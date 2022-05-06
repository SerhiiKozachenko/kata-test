(ns kata-test1.core
  (:gen-class))


;; Item   Unit      Special
;;        Price     Price
;; --------------------------
;;   A     50       3 for 130
;;   B     30       2 for 45
;;   C     20
;;   D     15

(def pricing-rules {\A {:single-price   50
                        :discount-price 130
                        :discount-qty   3}
                    \B {:single-price   30
                        :discount-price 45
                        :discount-qty   2}
                    \C {:single-price 20}
                    \D {:single-price 15}})

(defn total
  ([items] (total items nil))
  ([items pricing-rules]
   (->> items
        frequencies
        (reduce-kv (fn [acc item repeats]
                     (if-let [price (get pricing-rules item)]
                       (if-let [discount-qty (:discount-qty price)]
                         ;; discount
                         (let [discounted-items (quot repeats discount-qty)
                               single-items     (mod repeats discount-qty)]
                           (+ acc
                              (* discounted-items (:discount-price price))
                              (* single-items (:single-price price))))
                         ;; simple
                         (+ acc (* (:single-price price) repeats)))
                       acc))
                   0))))
