/**
 * Created by WebStorm.
 * User: timeNough Europe Inc.
 * Date: 28/12/2021
 * Time: 16:53
 */

/**
 * Click handlers
 * */

window.pageClickHandlers = 
(
) => {
	
	/**
	 * Scroll to item buttons
	 * */

	jQuery(
    	'.scrollDown',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
    		const beforeClickUri =
    		window.location.pathname + window.location.hash;

    		setTimeout(
    			() => {
		    		history
		    		.replaceState(
		    			{},
		    			'',
		    			beforeClickUri
		    		);
    			},
    			1500
    		);
    	}
 	);
		
	/**
	 * Reload listing
	 * */

	jQuery(
    	'#listing-reload',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
			window
			.location
			.reload();
    	}
 	);
		
	/**
	 * Not available mailbox folder
	 * */

	jQuery(
    	'.not-available-folder',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
    		e
    		.preventDefault();

		    Swal
		    .fire(
			    {
			        html: `Only two folders are currently available in this mailbox demo: <b>Inbox</b> and <b>Sent</b>.`,
			        icon: 'error',
			        buttonsStyling: false,
			        confirmButtonText: 'Ok, got it!',
			        customClass: {
			            confirmButton: "btn btn-danger"
			        }
			    }
		    );
    	}
 	);
		
	/**
	 * Real delete
	 * */

	jQuery(
    	'#reply-real-delete',
    	'body'
    )
    .on(
    	'click',
    	async (e) => {
    		e
    		.preventDefault();

    		Swal
            .fire(
                {
                    html: `Are you sure you want to <b>delete</b> this email?`,
                    icon: 'question',
                    iconColor: '#1b2471',
                    buttonsStyling: false,
                    showCancelButton: true,
                    reverseButtons: true,
        			cancelButtonText: 'Nope, cancel it',
                    confirmButtonText: 'Yes, do it',
                    customClass: {
                        confirmButton: 'btn btn-primary',
            			cancelButton: 'btn btn-light'
                    }
                }
            )
            .then(
            	async (sweetalert2Result) => {
					if(
						sweetalert2Result.isConfirmed
					){
						try {

							jQuery(
								'.content.flex-column-fluid',
								'body'
							)
							.addClass(
								'loading'
							);

							const emailsStatusConfirmation = 
							await window.timeNoughProprietaryFrontendTechnology
							.emailController
							.deleteEmail(
								{
									emailId: window.emailId[1]
								}
							);

							window
							.goBackFromReplyPage(
								''
							);

						}
						catch(e) {
							
							jQuery(
								'.content.flex-column-fluid',
								'body'
							)
							.removeClass(
								'loading'
							);

				            Swal
				            .fire(
				                {
				                    html: `While deleting the message,
				                    <br>a fatal <b>error</b> occurred.
				                    <br/>
				                    <br/>
				                    <em>
				                        Perhaps there is an issue on timeNough's side. If the problem persists, please contact <a href="mailto:mvp@timenough.com">mvp@timenough.com</a> with screenshots.
				                    </em>`,
				                    icon: 'error',
				                    buttonsStyling: false,
				                    confirmButtonText: 'Ok, got it!',
				                    customClass: {
				                        confirmButton: "btn btn-danger"
				                    }
				                }
				            );

						}
					}
				}		
			);
    	}
 	);
		
	/**
	 * Mark as unread
	 * */

	jQuery(
    	'#reply-read-onreply',
    	'body'
    )
    .on(
    	'click',
    	async (e) => {
    		e
    		.preventDefault();

			const emailsStatusConfirmation = 
			await window.timeNoughProprietaryFrontendTechnology
			.emailController
			.markAsRead(
				{
					emailId: window.emailId[1],
					read: false
				}
			);
			if(
				emailsStatusConfirmation.read === false
			){
				window
				.goBackFromReplyPage(
					''
				);
			}
    	}
 	);
		
	/**
	 * Not available feature buttons
	 * */

	jQuery(
    	'#listing-archive, #listing-read, #listing-move, ' +
    	'#listing-user-menu a, #listing-save-changes, #listing-search, #listing-view-all, #listing-view-read, #listing-view-unread, ' +
    	'#listing-view-starred, #listing-view-unstarred, #listing-sort-newest, #listing-sort-oldest, #listing-sort-unread, ' +
    	'#listing-sett-newgroup, #listing-sett-contacts, #listing-sett-groups, #listing-sett-calls, #listing-sett-settings, ' + 
    	'#listing-sett-help, #listing-sett-privacy, #reply-archive, #reply-delete, #reply-read, #reply-spam, #reply-move, ' + 
    	'#reply-privacy, #reply-ngroup, #reply-contacts, #reply-groups, #reply-calls, #reply-settings, #reply-help, ' + 
    	'#reply-star, #reply-important, #reply-settings, #reply-map, #reply-settings2, #reply-delete2',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
    		e
    		.preventDefault();

		    Swal
		    .fire(
			    {
			        html: `Feature not available in this mailbox demo.`,
			        icon: 'error',
			        buttonsStyling: false,
			        confirmButtonText: 'Ok, got it!',
			        customClass: {
			            confirmButton: "btn btn-danger"
			        }
			    }
		    );
    	}
 	);
		
	/**
	 * Print
	 * */

	jQuery(
    	'#reply-print',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
    		e
    		.preventDefault();

		    return jQuery(
		    	'html'
		    ).animate(
		    	{
		    		scrollTop: 0
		    	},
		    	'fast',
		    	'swing',
		    	() => {
    				window
    				.print();
				}
			);
    	}
 	);
		
	/**
	 * Sent email
	 * */

	jQuery(
    	'#reply-print***************',
    	'body'
    )
    .on(
    	'click',
    	(e) => {
    		e
    		.preventDefault();
    		// https://www.timenough.com/demo/mailboxes/1.j.doeson/#sent-to=test@example.com
    	}
 	);

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

};