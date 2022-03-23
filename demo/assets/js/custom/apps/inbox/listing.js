"use strict";
var KTAppInboxListing = (() => {
	window.currentMailTable;
    var t,
        e = () => {
            document.querySelector("#kt_inbox_listing_wrapper > .row").classList.add("px-9", "pt-3", "pb-5");
        },
        f = (table) => {
            if ( ! table.data().count() ) {
        		document.querySelector("td.newEmpty").classList.add("tableVisible");
			}
			else{
        		document.querySelector("td.newEmpty").classList.remove("tableVisible");
			}
        };
    return {
        init: () => {
            (t = document.querySelector("#kt_inbox_listing")) &&
                ((window.currentMailTable = $(t).DataTable(
                		{ 
                			info: !1, 
                			order: [],
                            responsive: true,
				            language: {
							    "infoEmpty": "No entries to show",
							    "emptyTable": "No email found here",
							    "loadingRecords": "Please wait - loading mail box"
							},
                            initComplete: function(settings, json) {
                                jQuery(
                                    'select[name="kt_inbox_listing_length"]',
                                    'body'
                                )
                                    .select2(
                                        {
                                            minimumResultsForSearch: 1000
                                        }
                                    )
                                    .on(
                                        'select2:select',
                                        (e) => {
                                            const data =
                                                e
                                                    .params
                                                    .data;
                                        }
                                    );
                            }
                		}
                	)).on("draw", () => {
                    e();
                	f(window.currentMailTable);
                    /* 
                     * Start : click on the <td> make a click on one of its links 
                     */
                    jQuery(
                        '.table td:not(.dtr-control)'
                    )
                    .on(
                        'click',
                        (e) => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            e.stopPropagation();

                            const parentTh =
                            jQuery(
                                e.currentTarget
                            )
                            .parent();

                            const rowLink =
                            parentTh
                            .find(
                                '.row-link'
                            );

                            if(
                                rowLink.length
                            ){
                                const link = 
                                rowLink[0];

                                const clickEvent = 
                                document
                                .createEvent(
                                    'MouseEvents'
                                );

                                clickEvent
                                .initEvent(
                                    'click',
                                    true,
                                    true
                                );

                                return link
                                .dispatchEvent(
                                    clickEvent
                                );
                            }
                        }
                    );
                    /* End : click on the <td> make a clikc on one of its links */
                }));
                document.querySelector('[data-kt-inbox-listing-filter="search"]').addEventListener("keyup", (t) => {
                    window.currentMailTable.search(t.target.value).draw();
                });
                e();
                f(window.currentMailTable);
        },
    };
})();
KTUtil.onDOMContentLoaded(function () {
    KTAppInboxListing.init();
});
