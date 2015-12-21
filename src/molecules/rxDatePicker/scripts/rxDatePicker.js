angular.module('encore.ui.molecules')
/**
 * @name molecules.directive:rxDatePicker
 * @ngdoc directive
 * @restrict E
 * @scope
 * @description
 * Basic date picker.
 *
 * ## Notice
 * This molecule is designed to be used in conjunction with other picker
 * molecules to compose a valid ISO 8601 DateTime string in the format of
 * <code>YYYY-MM-DDTHH:mm:ssZ</code>.
 *
 * * This molecule will generate a **String** in the format of `YYYY-MM-DD`
 *   to be used as the date portion of the ISO 8601 standard DateTime string
 *   mentioned above.
 * * This molecule will never generate anything other than a String.
 *
 * @param {expression} ngModel
 * Expression that evaluates to a date string in `YYYY-MM-DD` format
 *
 * @return {String} **IMPORTANT** returns an ISO8601 standard date string in the
 * formate of `YYYY-MM-DD`.
 */
.directive('rxDatePicker', function () {
    return {
        templateUrl: 'templates/rxDatePicker.html',
        restrict: 'E',
        require: 'ngModel',
        scope: {
            selected: '=ngModel'
        },
        link: function (scope, element, attrs, ngModelCtrl) {
            var today = moment(new Date());
            var isoFormat = 'YYYY-MM-DD';

            scope.popupVisible = false;
            // keep track of which month we're viewing in the popup (default to 1st of this month)
            scope.calendarMonth = today.clone().startOf('month');

            /* ===== "Public" Functions ===== */
            scope.togglePopup = function () {
                if (_.isUndefined(attrs.disabled)) {
                    scope.popupVisible = !scope.popupVisible;
                }
            };//togglePopup()

            scope.closePopup = function () {
                scope.popupVisible = false;
            };//closePopup

            /**
             * @param {String} destination
             * @description Modifies `scope.calendarMonth` to regenerate calendar
             */
            scope.navigate = function (destination) {
                var newCalendarMonth = scope.calendarMonth.clone();
                switch (destination) {
                    case 'nextMonth': {
                        newCalendarMonth.add(1, 'month');
                        break;
                    }
                    case 'prevMonth': {
                        newCalendarMonth.subtract(1, 'month');
                        break;
                    }
                }
                scope.calendarMonth = newCalendarMonth;
            };//navigate

            /**
             * @param {Moment} date
             */
            scope.selectDate = function (date) {
                scope.selected = date.format(isoFormat);
                scope.popupVisible = false;
            };//selectDate()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isToday = function (day) {
                return moment(day).isSame(today, 'day');
            };//isToday()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isMonth = function (day) {
                return moment(day).isSame(scope.calendarMonth, 'month');
            };//isMonth()

            /**
             * @param {Moment} day
             * @return {Boolean}
             */
            scope.isSelected = function (day) {
                if (_.isUndefined(scope.selected)) {
                    return false;
                } else {
                    return moment(day).isSame(scope.selected, 'day');
                }
            };//isSelected()

            /* ===== OBSERVERS ===== */

            // Set calendar month on change of selected date
            scope.$watch('selected', function (newVal) {
                if (!_.isEmpty(newVal)) {
                    var parsed = moment(newVal, isoFormat);

                    if (parsed.isValid()) {
                        scope.calendarMonth = parsed.startOf('month');
                    }
                }
            });

            // Regenerate calendar if month changes
            scope.$watch('calendarMonth', function (newVal) {
                scope.calendarDays = buildCalendarDays(newVal);
            });

            ngModelCtrl.$formatters.push(function (modelVal) {
                var parsed = moment(modelVal, isoFormat);
                ngModelCtrl.$setValidity('date', parsed.isValid());

                if (parsed.isValid()) {
                    return parsed.format('MMMM DD, YYYY');
                } else {
                    return null;
                }
            });

            ngModelCtrl.$render = function () {
                scope.displayValue = ngModelCtrl.$viewValue;
            };

            /**
             * @param {Moment} firstOfMonth
             * @return {Array<Moment>}
             * @description
             * Generate an array of Moment objects representing the visible
             * days on the calendar. This will automatically pad the calendar
             * with dates from previous/next month to fill out the weeks.
             */
            function buildCalendarDays (firstOfMonth) {
                var dateToken = firstOfMonth.clone().startOf('day');
                var currentMonth = dateToken.month();
                var days = [];
                var prependDay, appendDay;

                // add calendar month's days
                while (dateToken.month() === currentMonth) {
                    days.push(dateToken.clone());
                    dateToken.add(1, 'day');
                }

                // until first item of array is Sunday, prepend earlier days to array
                while (_.first(days).day() > 0) {
                    prependDay = _.first(days).clone();
                    days.unshift(prependDay.subtract(1, 'day'));
                }

                // until last item of array is Saturday, append later days to array
                while (_.last(days).day() < 6) {
                    appendDay = _.last(days).clone();
                    days.push(appendDay.add(1, 'day'));
                }

                return days;
            }//buildCalendarDays
        }
    };
});
