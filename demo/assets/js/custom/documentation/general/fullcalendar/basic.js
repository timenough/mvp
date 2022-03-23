"use strict";
var KTGeneralFullCalendarBasicDemos = {
    init: function () {
        var e, t, i, n, r, o;
        (e = moment().startOf("day")),
            (n = e.format("YYYY-MM-DD")),
            (o = document.getElementById("timeNough_calender")),
            new FullCalendar.Calendar(o, {
                headerToolbar: null,
                height: 800,
                contentHeight: 780,
                aspectRatio: 3,
                nowIndicator: !0,
                now: n + "T09:25:00",
                views: { dayGridMonth: { buttonText: "month" }, timeGridWeek: { buttonText: "week" }, timeGridDay: { buttonText: "day" } },
                initialView: "listMonth",
                initialDate: n,
                editable: !0,
                dayMaxEvents: !0,
                navLinks: !0,
                events: window.calendarEvents,
                eventContent: function (e) {
                    var t = $(e.el);
                    e.event.extendedProps &&
                    e.event.extendedProps.description &&
                    (t.hasClass("fc-day-grid-event")
                        ? (t.data("content", e.event.extendedProps.description), t.data("placement", "top"), KTApp.initPopover(t))
                        : t.hasClass("fc-time-grid-event")
                            ? t.find(".fc-title").append('<div class="fc-description">' + e.event.extendedProps.description + "</div>")
                            : 0 !== t.find(".fc-list-item-title").lenght && t.find(".fc-list-item-title").append('<div class="fc-description">' + e.event.extendedProps.description + "</div>"));
                },
            }).render();
    },
};
KTUtil.onDOMContentLoaded(function () {
    KTGeneralFullCalendarBasicDemos.init();
});
