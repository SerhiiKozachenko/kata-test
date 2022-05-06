import moment from "moment";
import knex from "knexClient";

export default async function getAvailabilities(date, numberOfDays = 7) {
  const availabilitiesByDayOfWeek = new Map();
  for (let i = 0; i < numberOfDays; ++i) {
    const tmpDate = moment(date).add(i, "days");
    const dayOfWeek = tmpDate.format("d");

    if (!availabilitiesByDayOfWeek.has(dayOfWeek)) {
      availabilitiesByDayOfWeek.set(dayOfWeek, []);
    }
    
    const dates = availabilitiesByDayOfWeek.get(dayOfWeek);
    dates.push({
      date: tmpDate.toDate(),
      slots: new Set()
    });
  }

  const endDate = moment(date).add(numberOfDays - 1, "days")
  const events = await knex
    .select("kind", "starts_at", "ends_at", "weekly_recurring")
    .from("events")
    .where(function() {
      this.where("weekly_recurring", true).andWhere("starts_at", "<=", +endDate);
    })
    .orWhereBetween("starts_at", [+date, +endDate]);

  // Sort events by kind, openings go first
  events.sort((a, b) => {
    const akind = a.kind === "opening" ? 1 : 0;
    const bkind = b.kind === "opening" ? 1 : 0;
    return bkind - akind;
  });

  for (const event of events) {
    for (
      let date = moment(event.starts_at);
      date.isBefore(event.ends_at);
      date.add(30, "minutes")
    ) {
      const dates = availabilitiesByDayOfWeek.get(date.format("d"));
      if (event.kind === "opening") {
        if (event.weekly_recurring) {
          dates.forEach(day => {
            if (moment(day.date).isSameOrAfter(event.starts_at, 'day')) {
              day.slots.add(date.format("H:mm"));
            }
          });
        } else {
          let eventDate = dates.find(day => moment(day.date).isSame(event.starts_at, 'day'));
          eventDate.slots.add(date.format("H:mm"));
        }
      } else if (event.kind === "appointment") {
        let eventDate = dates.find(day => moment(day.date).isSame(event.starts_at, 'day'));
        eventDate.slots.delete(date.format("H:mm"));
      }
    }
  }

  // flatten, map slots set to array and sort by dates asc
  const availabilities = [].concat.apply([],
      Array.from(availabilitiesByDayOfWeek.values())
    )
    .map(a => ({...a, slots: Array.from(a.slots)}))
    .sort((a, b) => a.date - b.date);

  return availabilities;
}
