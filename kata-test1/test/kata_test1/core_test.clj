(ns kata-test1.core-test
  (:require [clojure.test :refer :all]
            [kata-test1.core :refer :all]))

(deftest total-test
  (testing "total checkout"

    (is (= (total "") 0))

    (is (= (total "A" pricing-rules) 50))

    (is (= (total "C" pricing-rules) 20))

    (is (= (total "AC" pricing-rules) 70))

    (is (= (total "ABC" pricing-rules) 100))

    (is (= (total "ABCD" pricing-rules) 115))

    (is (= (total "   " pricing-rules) 0))

    (is (= (total "ABX" pricing-rules) 80))

    (is (= (total "CCC" pricing-rules) 60))

    (is (= (total "AAA" pricing-rules) 130))

    (is (= (total "AAAAA" pricing-rules) 230))

    (is (= (total "AAAAAB" pricing-rules) 260))

    (is (= (total "AAAAAA" pricing-rules) 260))

    (is (= (total "BB" pricing-rules) 45))

    (is (= (total "BBA" pricing-rules) 95))

    (is (= (total "BAB" pricing-rules) 95))

    (is (= (total "BBB" pricing-rules) 75))

    (is (= (total "BBBB" pricing-rules) 90))))
