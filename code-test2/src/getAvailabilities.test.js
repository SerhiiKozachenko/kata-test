import knex from "knexClient";
import moment from "moment";
import getAvailabilities from "./getAvailabilities";

describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());

  describe("no opening", () => {
    it("has no available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);
      for (let i = 0; i < 7; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("recurring opening in past", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("has available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("recurring opening in past and appointment", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("has available slots, except booked by appointment", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("multiple recurring openings in past", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }, {
          kind: "opening",
          starts_at: new Date("2014-08-05 09:00"),
          ends_at: new Date("2014-08-05 14:00"),
          weekly_recurring: true
        }
      ]);
    });

    it("has available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[2].date)).toBe(
        String(new Date("2014-08-12"))
      );
      expect(availabilities[2].slots).toEqual([
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("non-recurring opening", () => {
    beforeEach(async () => {
      await knex("events").insert([{
          kind: "opening",
          starts_at: new Date("2014-08-11 09:30"),
          ends_at: new Date("2014-08-11 12:30")
        }
      ]);
    });

    it("has available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("non-recurring opening and appointment", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-11 09:30"),
          ends_at: new Date("2014-08-11 12:30")
        }
      ]);
    });

    it("has available slots, except booked by appointment", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("multiple non-recurring openings", () => {
    beforeEach(async () => {
      await knex("events").insert([{
          kind: "opening",
          starts_at: new Date("2014-08-11 09:30"),
          ends_at: new Date("2014-08-11 12:30")
        }, {
          kind: "opening",
          starts_at: new Date("2014-08-12 09:00"),
          ends_at: new Date("2014-08-12 14:00")
        }
      ]);
    });

    it("has available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"));
      expect(availabilities.length).toBe(7);

      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[2].date)).toBe(
        String(new Date("2014-08-12"))
      );
      expect(availabilities[2].slots).toEqual([
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
    });
  });

  describe("recurring opening in future and appointment", () => {

    const testDate = new Date("2014-08-10");

    const appointment = {
      kind: "appointment",
      starts_at: new Date("2014-08-11 10:30"),
      ends_at: new Date("2014-08-11 11:30")
    };

    const openingInFuture = {
      kind: "opening",
      starts_at: new Date("2018-08-04 09:30"),
      ends_at: new Date("2018-08-04 12:30"),
      weekly_recurring: true
    };

    beforeEach(async () => {
      await knex("events").insert([
        appointment,
        openingInFuture
      ]);
    });

    it("has no available slots", async () => {
      const availabilities = await getAvailabilities(testDate);
      expect(availabilities.length).toBe(7);
      
      expect(String(availabilities[0].date)).toBe(String(testDate));
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );
      // Check that it's same day of week as recurring event
      expect(moment(availabilities[6].date).format("d")).toBe(
        moment(openingInFuture.starts_at).format("d")
      );
      // Suppose to be empty because recurring event starts in the future
      expect(availabilities[6].slots).toEqual([]);
      // All slots suppose to be empty because no opening
      availabilities.forEach(a => expect(a.slots).toEqual([]));
    });
  });

  describe("getAvailabilities for 14 days with recurring duplicated opening and appointment and non-recurring opening", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }, {
          kind: "opening",
          starts_at: new Date("2014-08-11 09:30"),
          ends_at: new Date("2014-08-11 12:30")
        }, {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        }, {
          kind: "opening",
          starts_at: new Date("2014-08-12 09:00"),
          ends_at: new Date("2014-08-12 14:00")
        }
      ]);
    });

    it("has available slots", async () => {
      const availabilities = await getAvailabilities(new Date("2014-08-10"), 14);
      expect(availabilities.length).toBe(14);

      // starts and ends with correct dates
      expect(String(availabilities[0].date)).toBe(
        String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[13].date)).toBe(
        String(new Date("2014-08-23"))
      );
      expect(availabilities[13].slots).toEqual([]);

      // has available slots where some already booked by appointment
      expect(String(availabilities[1].date)).toBe(
        String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      // non-recurring opening
      expect(String(availabilities[2].date)).toBe(
        String(new Date("2014-08-12"))
      );
      expect(availabilities[2].slots).toEqual([
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30"
      ]);

      expect(String(availabilities[6].date)).toBe(
        String(new Date("2014-08-16"))
      );

      // has available slots for full time b/c no appointment in that day
      expect(String(availabilities[8].date)).toBe(
        String(new Date("2014-08-18"))
      );
      expect(availabilities[8].slots).toEqual([
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00"
      ]);

      // no slots because that opening is not recurring
      expect(String(availabilities[9].date)).toBe(
        String(new Date("2014-08-19"))
      );
      expect(availabilities[9].slots).toEqual([]);
    });
  });
});
