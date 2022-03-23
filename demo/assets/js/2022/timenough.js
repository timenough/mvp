/**
 * Created by WebStorm.
 * User: timeNough Europe Inc.
 * Date: 28/12/2021
 * Time: 14:31
 */

/**
 * Global variables
 * */

window
.timeNoughProprietaryFrontendTechnologyEmailsPictoURL1 =
'https://icon.horse/icon/';

window
.timeNoughProprietaryFrontendTechnologyEmailsPictoURL2 =
'https://gravatar.com/avatar/';

window
.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps =
0;

window
.timeNoughProprietaryFrontendTechnologyEmailsDisplayed =
0;

window
.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread =
0;

window
.timeNoughProprietaryFrontendTechnologyKnownSubjects =
[];

window
.emailNotificationToastsContainer = 
document
.getElementById(
	'kt_docs_toast_stack_container'
);

window
.newEmailNotificationToastModel = 
document
.querySelector(
	'[data-kt-docs-toast="stack"]'
);

if(
	window
	.newEmailNotificationToastModel
)window
.newEmailNotificationToastModel
.parentNode
.removeChild(
	window
	.newEmailNotificationToastModel
);

/**
 * Page title changer
 * */

window
.pageTitleChanger = 
(
	unreadEmails
) => {
	var currentTitle = 
	document
	.title;

	const currentTitleMatches = [
		...currentTitle
		.matchAll(
			/^(\([0-9]+\))(.*?)$/gm
		)
	];

	if(
		unreadEmails > 0
	){
		if(
			currentTitleMatches[0] &&
			currentTitleMatches[0][1] &&
			currentTitleMatches[0][2]
		){
			currentTitle =
			currentTitleMatches[0][2];
		}

		const newTitle =
		'(' + 
		unreadEmails  + 
		') ' + 
		currentTitle;

		document
		.title = 
		newTitle;

		window
		.parent
		.document
		.title =
		newTitle;

		jQuery(
	    	'#inbox-unread-count',
	    	'body'
	    )
    	.attr(
    		'data-value',
    		unreadEmails
    	);
	}
};

/**
 * Page loader disabler
 * */

window
.pageLoaderDisabler = 
() => {
	jQuery(
		'.content.flex-column-fluid',
		'body'
	)
	.removeClass(
		'loading'
	);
};

/**
 * Email in box data processing
 * */

window
.emailsInListProcessing = 
async (
	email, 
	index,
	totalEmails,
	mailboxId,
	inboxCase
) => {

	const now =
	moment ();

	/**
	 * Email object "keys"
	 * */

	const emailTotalDetails = 
	Object.keys(
		email
	).length;

	/**
	 * Email "subject"
	 * */

	const emailSubject = 
	email
	.subject;

	if(
		window
		.timeNoughProprietaryFrontendTechnologyKnownSubjects
		.indexOf(
			emailSubject
		) > -1
	){
		return false;
	}
	else{
		window
		.timeNoughProprietaryFrontendTechnologyKnownSubjects
		.push(
			emailSubject
		);
	}

	/**
	 * Email "createdDate"
	 * */

	const emailTime =
	moment (
		email
		.createdAt
	);

	const emailShouldBeDelete =
	now
	.diff(
		emailTime, 
		'minutes'
	) >= 58;

	/**
	 * Email "status"
	 * */

	const emailStatus = 
	email
	.read;

	/**
	 * Email "from"
	 * */

	const emailFrom = 
	email
	.from;

	/**
	 * Email "to"
	 * */

	const emailTo = 
	email
	.to[0];

	/**
	 * Email "considered"
	 * */

	var emailConsidered = 
	inboxCase ?
	emailFrom :
	emailTo;

	/**
	 * Email "from website"
	 * */

	const emailConsideredWebsite = 
	emailConsidered
	.substring(
		emailConsidered
		.lastIndexOf(
			'@'
		) +
		1
	); 

	/**
	 * Email "from name"
	 * */

	var emailConsideredName = 
	emailConsidered
	.match(
		/^.+(?=@)/
	)[0]
	.replace(
		'-',
		' '
	)
	.replace(
		'.',
		' '
	)
	.replace(
		'_',
		' '
	)
	.replace(
		/\b\w/g,
		c => c.toUpperCase()
	);

	if(
		emailConsideredName === 'B'
	){
		emailConsideredName =
		'CoreNough Bot';
		emailConsidered =
		'b@corenough.com';
	}

	/**
	 * Email "icon.horse API icon"
	 * */

    const emailPicto =
		timeNoughProprietaryFrontendTechnologyEmailsPictoURL1 + emailConsideredWebsite;

	/**
	 * Email "RAW content"
	 * *

	const emailRawContent = 
  	await window.timeNoughProprietaryFrontendTechnology
	.emailController
	.getRawEmailContents(
		{
			emailId: email.id
		}
	);

	/**
	 * Email "HTML body"
	 * *

	const emailHTMLBody = 
	await window.timeNoughProprietaryFrontendTechnology
	.emailController
	.getEmailTextLines(
		{
			decodeHtmlEntities: true,
			emailId: email.id,
			lineSeparator: "\n"
		}
	);
	*/

	/**
	 * Email Drawing
	 * */

	window
	.currentMailTable
	.row
	.add(
		jQuery(
			window
			.newEmailHtmlRow(
				email.id,
				inboxCase ? (emailStatus ? '' : 'unread') + (emailShouldBeDelete ? ' dn' : '') : '',
				window.inboxUris + (inboxCase ? 'reply' : 'read') + '.html#emailId=' + email.id,
				emailPicto,
				inboxCase ? emailConsideredName : 'To: ' + emailConsideredName,
				email.subject,
				inboxCase ? 'From ' + emailConsidered : emailConsidered,
				'', // '<div class="badge badge-light-primary">crucial</div><div class="badge badge-light-warning">information</div>'
				moment(
					email.createdAt
				)
				.format(
					'YYYYMMDD.HH:mm:ss'
				),
				'', // 'text-muted'
				email.attachments
			)
		)
	)
	.order(
		[
			4,
			'desc'
		]
	)
	.draw();

	/**
	 * Email time update
	 * */

	window
	.emailDatesAgo(
		false
	);

	/**
	 * Email totals update
	 * */

	window
	.timeNoughProprietaryFrontendTechnologyEmailsDisplayed++;

	if(
		inboxCase &&
		!emailStatus
	)window
	.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread++;

	/**
	 * Email right sender picto
	 * */

	const emailGravatarPicto =
		timeNoughProprietaryFrontendTechnologyEmailsPictoURL2 + md5(emailConsidered) + '?&d=404';
	jQuery
	.ajax(
	 	{
	        type: 'HEAD',
	        timeout: 3000,
	        crossDomain: true,
	        url: emailGravatarPicto,
	        success: (e)=>{
	        	jQuery(
	        		'#' + email.id + ' .sender-picto',
	        		'body'
	        	)
				.css(
					'backgroundImage',
					'url(' + emailGravatarPicto + ')'
				);
	        }
	    }
	);

	/**
	 * Page title update
	 * */

	if(
		inboxCase
	)window
	.pageTitleChanger(
		window
		.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread
	);

	/**
	 * Inbox case only
	 * */

	if(
		inboxCase
	){

		/**
		 * Email right sender name
		 * */

		const emailCompleteRetrieve = 
		await window.timeNoughProprietaryFrontendTechnology
		.emailController
		.getEmail(
			{
				decode: false,
				emailId: email.id
			}
		);

		if(
			emailCompleteRetrieve.sender && 
			emailCompleteRetrieve.sender.name
		){
			jQuery(
				'#' + email.id + ' .sender-name',
				'body'
			)
			.html(
				emailCompleteRetrieve.sender.name
			);
		}

		/**
		 * Email should be deleted?
		 * */

		if(
			emailShouldBeDelete
		){
			const emailsStatusConfirmation = 
			await window.timeNoughProprietaryFrontendTechnology
			.emailController
			.deleteEmail(
				{
					emailId: email.id
				}
			);
		}

		/**
		 * New email re-marked as unread by force
		 * */

		if(
			!emailStatus &&
			emailTotalDetails > 9
		){
			const emailsStatusConfirmation = 
			await window.timeNoughProprietaryFrontendTechnology
			.emailController
			.markAsRead(
				{
					emailId: email.id,
					read: false
				}
			);
		}

		/**
		 * Email is the last one
		 * */

		if(
			index + 1 === totalEmails
		){

			/**
			 * Wait for the next unread emails
			 * */

			try {

				const lastUnreadEmail = 
				await window.timeNoughProprietaryFrontendTechnology
				.waitController
				.waitForNthEmail(
					{
						inboxId: mailboxId,
						index: window.timeNoughProprietaryFrontendTechnologyEmailsDisplayed,
						timeout: 119999,
						delay: 1000
					}
				);

				window
				.emailsInListProcessing(
					lastUnreadEmail,
					0,
					1,
					mailboxId,
					inboxCase
				);

			}
			catch (
				e
			) {

				window
				.location
				.reload();

			}

		}

	}

};

/**
 * Email body HTML formatter
 * */

window
.bodyHtmlFormatter = 
(
	body
) => {
	return body
	.split(
		'href'
	)
	.join(
		'target="_blank" href'
	)
	.replace(
		'analytics',
		'nope'
	);
};

/**
 * Email rows HTML
 * */

window
.newEmailHtmlRow = 
(
	id,
	readClass,
	href, 
	picto, 
	senderName, 
	title, 
	subtitle, 
	tags, 
	moment, 
	momentWeight,
	attachments
) => {
	const textBold = 
	readClass === 'unread' ? 
		' fw-bold' :
		'';
	const htmlString = 
	'<tr class="' + readClass + '" id="' + id + '">'+
		'<td class="ps-9">'+
			'<div class="form-check form-check-sm form-check-custom form-check-solid mt-3">'+
				'<input class="form-check-input" type="checkbox" value="1" />'+
			'</div>'+
		'</td>'+
		'<td class="min-w-35px">'+
			'<a href="' + href + '" target="_self" class="btn btn-icon btn-color-gray-400 btn-sm btn-active-color-primary row-link" data-bs-toggle="tooltip" data-bs-placement="right" title="Star">'+
				'<span class="svg-icon svg-icon-2">'+
					'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">'+
						'<path d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z" fill="black" />'+
					'</svg>'+
				'</span>'+
			'</a>'+
		'</td>'+
		'<td class="w-175px">'+
			'<a href="' + href + '" target="_self" class="d-flex align-items-center text-dark">'+
				'<div class="symbol symbol-35px me-3">'+
					'<span class="symbol-label sender-picto" style="background-image:url(' + picto + ')"></span>'+
				'</div>'+
				'<span class="sender-name' + textBold + '">'+
					senderName+
				'</span>'+
			'</a>'+
		'</td>'+
		'<td>'+
			'<div class="text-dark mb-1">'+
				'<a href="' + href + '" target="_self" class="text-dark">'+
					'<span class="mail-title' + textBold + '">'+
						title+'&nbsp;'+
					'</span> '+
					'<span class="text-muted">'+
						'- '+subtitle+
					'</span>'+
				'</a>'+
			'</div>'+
			tags+
		'</td>'+
		'<td class="w-100px text-end fs-7 pe-9 attachment-icon-parent">'+
			'<span class="timeago ' + momentWeight + '">'+
				moment+
			'</span>'+
			'<span class="svg-icon svg-icon-2 attachment ' + (attachments && attachments.length === 0 ? 'hidden' : '') + '">'+
				'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">'+
					'<path opacity="0.3" d="M4.425 20.525C2.525 18.625 2.525 15.525 4.425 13.525L14.825 3.125C16.325 1.625 18.825 1.625 20.425 3.125C20.825 3.525 20.825 4.12502 20.425 4.52502C20.025 4.92502 19.425 4.92502 19.025 4.52502C18.225 3.72502 17.025 3.72502 16.225 4.52502L5.82499 14.925C4.62499 16.125 4.62499 17.925 5.82499 19.125C7.02499 20.325 8.82501 20.325 10.025 19.125L18.425 10.725C18.825 10.325 19.425 10.325 19.825 10.725C20.225 11.125 20.225 11.725 19.825 12.125L11.425 20.525C9.525 22.425 6.425 22.425 4.425 20.525Z" fill="black"></path>'+
					'<path d="M9.32499 15.625C8.12499 14.425 8.12499 12.625 9.32499 11.425L14.225 6.52498C14.625 6.12498 15.225 6.12498 15.625 6.52498C16.025 6.92498 16.025 7.525 15.625 7.925L10.725 12.8249C10.325 13.2249 10.325 13.8249 10.725 14.2249C11.125 14.6249 11.725 14.6249 12.125 14.2249L19.125 7.22493C19.525 6.82493 19.725 6.425 19.725 5.925C19.725 5.325 19.525 4.825 19.125 4.425C18.725 4.025 18.725 3.42498 19.125 3.02498C19.525 2.62498 20.125 2.62498 20.525 3.02498C21.325 3.82498 21.725 4.825 21.725 5.925C21.725 6.925 21.325 7.82498 20.525 8.52498L13.525 15.525C12.325 16.725 10.525 16.725 9.32499 15.625Z" fill="black"></path>'+
				'</svg>'+
			'</span>'
		'</td>'+
	'</tr>';
	return htmlString;
};

/**
 * Email attachments HTML
 * */

window
.newEmailHtmlAttachment = 
(
	fileHref,
	fileName,
	fileSize,
	fileSizeUnit
) => {
	return '<div class="dropzone-item dz-processing dz-success dz-complete dz-image-preview">' +
        '<div class="dropzone-file">' +
            '<div class="dropzone-filename" title="' + fileName + '">' +
            	'<a href="' + fileHref + '" target="_blank" download="' + fileName + '">' +
	                '<span data-dz-name="">' +
	                	fileName +
	                '</span>&nbsp;' +
	                '<strong>' +
	                	'(' +
	                		'<span data-dz-size="">' +
		                		'<strong>' + fileSize + '</strong> ' + fileSizeUnit +
		                	'</span>' +
	                	')' +
	                '</strong>' +
	    		'</a>' +
            '</div>' +
        '</div>' +
        '<div class="dropzone-progress"></div>' +
        '<div class="dropzone-toolbar">' +
  			'<a href="' + fileHref + '" target="_blank" download="' + fileName + '">' +
	            '<span class="dropzone-delete" data-dz-remove="">' +
	            '<i class="bi bi-cloud-download fs-4"></i>' +
	            '</span>' +
	  		'</a>' +
        '</div>' +
    '</div>';
};

/**
 * Email attachments file size
 * */

window.
bytesToSize =
(
	bytes,
	justTheUnit
) => {
	const sizes = 
	[
		'Bytes',
		'Kb',
		'Mb',
		'Gb',
		'Tb'
	];

	if(
		bytes == 0
	){
		return justTheUnit ? 'Byte' : '0';
	}

	const i =
	parseInt(
		Math
		.floor(
			Math
			.log(
				bytes
			) / 
			Math
			.log(
				1024
			)
		)
	);

	return justTheUnit ? 
	sizes[i] : 
	Math
	.round(
		bytes / 
		Math
		.pow(
			1024,
			i
		),
		2
	);
};

/**
 * Email rows dates
 * */

window
.emailDatesAgo =
(
	alwaysExpressAgo
) => {
	document
	.querySelectorAll(
		'span.timeago'
	)
	.forEach(
		(
			element
		) => {

			var now =
			moment();

			var rawDate = 
			element
			.innerHTML;

			var processedDate =
			moment(
				rawDate, 
				'YYYYMMDD.HH:mm:ss'
			);

			var diffDates =
			now
			.diff(
				processedDate, 
				'hours'
			);

			var finalFormat = 
			processedDate
			.format(
				'MMM Do'
			);

			if (diffDates < 12) {
				finalFormat =
				processedDate
				.format(
					'HH:mm:ss'
				);
			}
			else if (
				diffDates >= 12 && 
				diffDates < 72
			) {
				finalFormat =
				processedDate
				.fromNow();
			}
			else if (diffDates > 360) {
				finalFormat =
				processedDate
				.format(
					'MM/DD/YY'
				);
			}

			if(
				alwaysExpressAgo
			){
				finalFormat =
				processedDate
				.fromNow();
			}

			element
			.classList
			.remove(
				'timeago'
			);

			element
			.innerHTML = 
			finalFormat;
		}
	);
};

/**
 * Reply go back button click
 * */

window
.goBackFromReplyPage = 
(
	changeHref
) => {
    if(
    	changeHref !== ''
    ){
    	jQuery(
	    	'#go-back',
	    	'body'
	    )
    	.attr(
    		'href',
    		jQuery(
		    	'#go-back',
		    	'body'
		    )
	    	.attr(
	    		'href'
	    	) + changeHref
    	);
    }
	const link = 
    jQuery(
    	'#go-back',
    	'body'
    )[0];

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
};

/**
 * Reply HTML iframe "src" update
 * */

window
.locationHashChangedInPreviewPage =
() => {
	window
	.emailId =
	window
	.location
	.hash
	.split('=');

	const iframe = 
	document
	.querySelector(
		'#htmail-parent'
	);

	if(
		window
		.emailId[1]
	){
		jQuery(
			window
		)
		.scrollTop();

		iframe
		.innerHTML = 
		'<iframe src="' + window.inboxUris + 'preview.html#emailId=' + window.emailId[1] + '" id="htmail"></iframe>';
	}
};

window
.locationHashChangedInPrereadPage =
() => {
	window
	.emailId =
	window
	.location
	.hash
	.split('=');

	const iframe = 
	document
	.querySelector(
		'#htmail-parent'
	);

	if(
		window
		.emailId[1]
	){
		jQuery(
			window
		)
		.scrollTop();

		iframe
		.innerHTML = 
		'<iframe src="' + window.inboxUris + 'preread.html#emailId=' + window.emailId[1] + '" id="htmail"></iframe>';
	}
};

/**
 * Mail Proprietary Technology stuff
 * */

/**
 * GET INBOXES 
 * *

const inboxes = 
await window.timeNoughProprietaryFrontendTechnology
.getAllInboxes(
	0,
	20
);
*/

window
.receivedLoading = 
async (
	silent
) => {

	try {

		/**
		 * GET INBOX CONTENT & UNREAD EMAILS
		 * */

		const getInboxEmails = 
		await window.timeNoughProprietaryFrontendTechnology
		.inboxController
		.getEmails(
			{
				inboxId: window.inboxId
			}
		);

		const unReadEmails =
		getInboxEmails
		.filter(
			(
				a, 
				b
			) => !a.read
		);
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread =
		unReadEmails
		.length;

		window
		.pageTitleChanger(
			window
			.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread
		);

		/**
		 * GET RECEIVED EMAILS
		 * */

		const lastUnreadEmail = 
		await window.timeNoughProprietaryFrontendTechnology
		.waitController
		.waitForLatestEmail(
			{
				inboxId: window.inboxId,
				timeout: 119999,
				delay: 1000,
				unreadOnly: true,
				since: moment()
			}
		);

		if(
			window.emailId &&
			window.emailId[1] &&
			lastUnreadEmail.id === window.emailId[1]
		)return;

		/**
		 * PREPARE NOTIFICATION TOAST
		 * */

	    const newEmailNotificationToastClone = 
	    window
	    .newEmailNotificationToastModel
	    .cloneNode(
	    	true
	    );

	    const newEmailNotificationToastClone_Icon = 
	    newEmailNotificationToastClone
	    .querySelector(
	    	'.notification-icon'
	    );
		const newEmailNotificationToastClone_Title = 
		newEmailNotificationToastClone
		.querySelector(
			'.notification-title'
		);
		const newEmailNotificationToastClone_Time = 
		newEmailNotificationToastClone.
		querySelector(
			'.notification-time'
		);
		const newEmailNotificationToastClone_Message = 
		newEmailNotificationToastClone
		.querySelector(
			'.notification-message'
		);

		/**
		 * CONFIGURE NOTIFICATION TOAST
		 * */

		newEmailNotificationToastClone_Title
		.innerHTML = 
		lastUnreadEmail.sender && lastUnreadEmail.sender.name ? 
			lastUnreadEmail.sender.name : 
			lastUnreadEmail.from;

		newEmailNotificationToastClone_Time
		.innerHTML =
		moment(
			lastUnreadEmail.createdAt, 
			'YYYYMMDD.HH:mm:ss'
		)
		.fromNow();

		newEmailNotificationToastClone_Message
		.innerHTML = 
		'<a href="reply.html#emailId=' + lastUnreadEmail.id + '" target="_parent">' +
			lastUnreadEmail
			.subject
		'</a>';

		/**
		 * SHOW NOTIFICATION TOAST
		 * */

	    window
	    .emailNotificationToastsContainer
	    .append(
	    	newEmailNotificationToastClone
	    );

	    const newEmailNotification = 
	    bootstrap
	    .Toast
	    .getOrCreateInstance(
	    	newEmailNotificationToastClone
	    );

	    newEmailNotification
	    .show();

		/**
		 * CHANGE PAGE TITLE
		 * */
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread++;

		window
		.pageTitleChanger(
			window
			.timeNoughProprietaryFrontendTechnologyEmailsDisplayedUnread
		);

		/**
		 * NEW EMAIL RE-MARKED AS UNREAD BY FORCE 
		 * */

		const emailsStatusConfirmation = 
		await window.timeNoughProprietaryFrontendTechnology
		.emailController
		.markAsRead(
			{
				emailId: lastUnreadEmail.id,
				read: false
			}
		);

		/**
		 * GET RECEIVED EMAILS AGAIN
		 * */

		window
		.receivedLoading(
			silent
		);
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps =
		0;

	}
	catch (
		e
	) {

		/**
		 * INCREASE ATTEMPTS NUMBER
		 * */
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps++;
		
		/**
		 * GET RECEIVED EMAILS AGAIN 
		 * */

		if(
		 	window
			.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps
			< 5
		) {

			setTimeout(
				() => {
					window
					.receivedLoading(
						silent
					);
				},
				1000
			);

		}
		else {

			if (
				!silent
			){

	            Swal
	            .fire(
	                {
	                    html: `While retrieving the email messages,
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
	            )
	            .then(
	            	(sweetalert2Result) => {
						if (
							sweetalert2Result.isConfirmed
						) {
							window
							.location
							.reload();
						}
					}		
				);

			}

		}

	}

};

window
.sentLoading = 
async () => {

	/**
	 * GET SENT EMAILS
	 * */

	const emailsSent = 
	await window.timeNoughProprietaryFrontendTechnology
	.inboxController
	.getInboxSentEmails(
		{
			inboxId: window.inboxId
		}
	);

	if(
		emailsSent
		.content
		.length
	)emailsSent
	.content
	.map(
		(	
			a, 
			b
		) => window
		.emailsInListProcessing(
			a,
			b,
			emailsSent.content.length,
			window.inboxId,
			false
		)
	);

	/**
	 * HIDE LOADER
	 * */

	window
	.pageLoaderDisabler();

};

window
.listingLoading = 
async () => {

	try {

		/**
		 * GET INBOXES
		 * *

		const inboxes = 
		await window.timeNoughProprietaryFrontendTechnology.getAllInboxes(0, 20);


		/**
		 * GET SENT EMAILS
		 * *

		const sentemails = 
		await window.timeNoughProprietaryFrontendTechnology
		.inboxController
		.getInboxSentEmails(
			{
				inboxId: window.inboxId
			}
		);

		/**
		 * GET INBOX EMAILS 
		 * */

		const emailsInBox = 
		await window.timeNoughProprietaryFrontendTechnology
		.inboxController
		.getEmails(
			{
				inboxId: window.inboxId
			}
		);

		if(
			emailsInBox
			.length
		)emailsInBox
		.map(
			(	
				a, 
				b
			) => window
			.emailsInListProcessing(
				a,
				b,
				emailsInBox.length,
				window.inboxId,
				true
			)
		);

		/**
		 * HIDE LOADER
		 * */

		window
		.pageLoaderDisabler();
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps =
		0;

	}
	catch (
		e
	) {

		/**
		 * INCREASE ATTEMPTS NUMBER
		 * */
		
		window
		.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps++;
		
		/**
		 * GET RECEIVED EMAILS AGAIN 
		 * */

		if(
		 	window
			.timeNoughProprietaryFrontendTechnologyEmailsGetAttemps
			< 5
		) {

			setTimeout(
				() => {
					window
					.listingLoading();
				},
				1000
			);

		}
		else {

            Swal
            .fire(
                {
                    html: `While retrieving the email messages,
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
            )
            .then(
            	(sweetalert2Result) => {
					if (
						sweetalert2Result.isConfirmed
					) {
						window
						.location
						.reload();
					}
				}		
			);

		}

	}

};

window
.emailLoading = 
async (
	emailId,
	readCase
) => {

	/**
	 * GET ONE EMAIL
	 * */

	const emailCompleteRetrieve = 
	readCase ?
	await window.timeNoughProprietaryFrontendTechnology
	.sentEmailsController
	.getSentEmail(
		{
			id: emailId
		}
	) :
	await window.timeNoughProprietaryFrontendTechnology
	.emailController
	.getEmail(
		{
			decode: false,
			emailId: emailId
		}
	);

	if(
		readCase
	){
		if(
			emailCompleteRetrieve
			.from
			.indexOf('<') < 0
		){
			emailCompleteRetrieve
			.from +=
			' <' +
			emailCompleteRetrieve
			.from +
			'>';
		}

		const splitFrom =
		emailCompleteRetrieve
		.from
		.split(
			'<'
		);

		emailCompleteRetrieve
		.replyTo =
		splitFrom[1]
		.replace(
			'>',
			''
		);

		emailCompleteRetrieve
		.sender = {
			name: splitFrom[0]
		};

		const recipients =
		emailCompleteRetrieve
		.to
		.concat(
			emailCompleteRetrieve
			.cc
		)
		.concat(
			emailCompleteRetrieve
			.bcc
		);

		jQuery(
			'#mail-recipients',
			'body'
		)
		.html(
			recipients
			.filter(
				Boolean
			)
			.join(
				',<br/>'
			)
		);
	}

	/**
	 * UPDATE EMAIL FIELDS
	 * */

	jQuery(
		'#mail-sender-replyto',
		'body'
	)
	.html(
		emailCompleteRetrieve.replyTo
	);

	jQuery(
		'#mail-title-1, #mail-title-2',
		'body'
	)
	.html(
		emailCompleteRetrieve.subject
	);

	jQuery(
		'#mail-subj',
		'body'
	)
	.val(
		'RE: ' + emailCompleteRetrieve.subject
	);

	jQuery(
		'#mail-sender-name-1, #mail-sender-name-2',
		'body'
	)
	.html(
		emailCompleteRetrieve.sender.name ?? emailCompleteRetrieve.sender.emailAddress
	);

	jQuery(
		'#mail-sent-date-1, #mail-sent-date-2',
		'body'
	)
	.html(
		moment(
			readCase ? emailCompleteRetrieve.sentAt : emailCompleteRetrieve.createdAt
		)
		.format(
			'LLLL'
		)
	);

	jQuery(
		'#mail-sent-ago',
		'body'
	)
	.html(
		moment(
			readCase ? emailCompleteRetrieve.sentAt : emailCompleteRetrieve.createdAt
		)
		.format(
			'YYYYMMDD.HH:mm:ss'
		)
	);

	const excerptMatches =
	emailCompleteRetrieve
	.body
	.match(
		/<body[^>]*>([\w|\W]*)<\/body>/im
	);

	jQuery(
		'#mail-excerpt',
		'body'
	)
	.html(
		'...' +
		(
			excerptMatches && excerptMatches[1] ? 
			jQuery(
				excerptMatches[1],
				'body'
			)
			.text() : 
			emailCompleteRetrieve.body
		)
		.replace(
			/\s{1,}/g,
			' '
		)
		.substr(
			0,
			120
		) +
		'...'
	);

	/**
	 * UPDATE EMAIL BODY
	 * */

	if(
		!readCase
	){
		window
		.quillItem
		.insertEmbed(
			1,
			'replyFreeHtmlEmbed',
			`<br/>
			<table style="border-left: 1px solid #a1a5b6;">
				<tbody>
					<tr>
						<td style="padding-left: 14px;">
							<p>
								On ${jQuery('#mail-sent-date-1', 'body').html()}, ${jQuery('#mail-sender-name-1', 'body').html()} &lt;${emailCompleteRetrieve.from}&gt; wrote:
							</p>
							${window.bodyHtmlFormatter(emailCompleteRetrieve.body)}
						</td>
					</tr>
				</tbody>
			</table>`,
			'silent',
	    );
		/*setTimeout(
			() => {
				window
				.quillItem
				.focus();
			},
			2000
		);*/
	}

	/**
	 * UPDATE EMAIL SENDER + PICTO
	 * */

	const emailGravatarPicto =
		timeNoughProprietaryFrontendTechnologyEmailsPictoURL2 + md5(emailCompleteRetrieve.from) + '?&d=404';

	const emailCompleteRetrieveDomain =
	emailCompleteRetrieve
	.from
	.substring(
		emailCompleteRetrieve
		.from
		.lastIndexOf(
			'@'
		) +
		1
	);

	jQuery
	.ajax(
	 	{
	        type: 'HEAD',
	        timeout: 3000,
	        crossDomain: true,
	        url: emailGravatarPicto,
	        error: (e) => {

				jQuery(
					'#mail-sender-picture',
					'body'
				)
				.css(
					'backgroundImage',
					'url(' + timeNoughProprietaryFrontendTechnologyEmailsPictoURL1 + emailCompleteRetrieveDomain + ')'
				);

				/**
				 * UPDATE EMAIL RECIPIENT FIELD
				 * */

				if(
					!readCase
				)window
				.tagLoading(
					window
					.tagifyItem[0],
					timeNoughProprietaryFrontendTechnologyEmailsPictoURL1 + emailCompleteRetrieveDomain,
					true,
					emailCompleteRetrieve,
					13
				);

			},
	        success: (e) => {

				jQuery(
					'#mail-sender-picture',
					'body'
				)
				.css(
					'backgroundImage',
					'url(' + emailGravatarPicto + ')'
				);

				/**
				 * UPDATE EMAIL RECIPIENT FIELD
				 * */

				if(
					!readCase
				)window
				.tagLoading(
					window
					.tagifyItem[0],
					emailGravatarPicto,
					true,
					emailCompleteRetrieve,
					13
				);

	        }
	    }
	);

	/**
	 * UPDATE CC FIELDS
	 * */

	if(
		!readCase &&
		emailCompleteRetrieve
		.cc
		.length
	){
		emailCompleteRetrieve
		.cc
		.map(
			(
				a, 
				b
			) => {
				window
				.tagLoading(
					window
					.tagifyItem[1],
					timeNoughProprietaryFrontendTechnologyEmailsPictoURL2 + md5(a) + '?&d=404',
					true,
					{
						replyTo: a,
						sender: {
							emailAddress: a,
							name: null
						},
					},
					b + 1
				);
				return a;
			}
		);
		jQuery(
			'#mail-cc',
			'body'
		)
		.addClass(
			'visible'
		)
		.click();
	}

	/**
	 *  UPDATE BCC FIELDS
	 * */

	if(
		!readCase &&
		emailCompleteRetrieve
		.bcc
		.length
	){
		emailCompleteRetrieve
		.bcc
		.map(
			(
				a, 
				b
			) => {
				window
				.tagLoading(
					window
					.tagifyItem[2],
					timeNoughProprietaryFrontendTechnologyEmailsPictoURL2 + md5(a) + '?&d=404',
					true,
					{
						replyTo: a,
						sender: {
							emailAddress: a,
							name: null
						},
					},
					b + 1
				);
				return a;
			}
		);
		jQuery(
			'#mail-bcc',
			'body'
		)
		.addClass(
			'visible'
		)
		.click();
	}

	/**
	 * UPDATE EMAIL ATTACHMENTS 
	 * */

	if(
		emailCompleteRetrieve
		.attachments &&
		emailCompleteRetrieve
		.attachments
		.length
	){
		var attachmentsHTML =
		'';

		emailCompleteRetrieve
		.attachments
		.map(
			async (
				a,
				b
			) => {
				const attachmentInfos =
				await window.timeNoughProprietaryFrontendTechnology
				.attachmentController
				.getAttachment(
					{
						attachmentId: a,
					}
				);

				const attachmentContents =
				await window.timeNoughProprietaryFrontendTechnology
				.attachmentController
				.downloadAttachmentAsBase64Encoded(
					{
						attachmentId: a
					}
				);

				attachmentsHTML +=
				window
				.newEmailHtmlAttachment(
					'data:' + attachmentInfos.contentType + ';base64,' + attachmentContents.base64FileContents,
					attachmentInfos
					.name,
					window
					.bytesToSize(
						attachmentInfos
						.contentLength,
						false
					),
					window
					.bytesToSize(
						attachmentInfos
						.contentLength,
						true
					)
				);

				if(
					b === emailCompleteRetrieve.attachments.length - 1
				){
					jQuery(
						'#attach-files-list .dropzone-items',
						'body'
					)
					.html(
						attachmentsHTML
					);
					jQuery(
						'#attach-files-list',
						'body'
					)
					.removeClass(
						'dn'
					);
				}

				return a;
			}
		);
	}

	/**
	 * UPDATE EMAIL DATE FROM NOW
	 * */

	window
	.emailDatesAgo(
		true
	);

};

window
.tagLoading = 
(
	tagObject,
	tagPicto,
	tagReadOnly,
	emailObject,
	emailItemId
) => {
	tagObject
	.addTags(
		[
			{
				value: emailItemId,
				name: emailObject.sender.name ?? emailObject.sender.emailAddress,
				avatar: tagPicto,
				email: emailObject.replyTo
			}
		]
	);

	if(
		tagReadOnly
	){
		tagObject
		.setReadonly(
			true
		);
	}
};

window
.senderInfosWeKnowByEmail =
(
	emailInput
) => {
	const sendersWeKnow =
		window
			.demoUsers
			.filter(
				(element, index) => {
					return index !== window.inboxIndex - 1;
				}
			);

	return sendersWeKnow.filter(
		(element, index) => {
            return element.email === emailInput;
        }
	);
};

/**
 * jQuery stuff
 * */

jQuery(
	document
)
.ready(
	async () => {

		if(
			window.inboxCase === 'sent'
		){

			/**
			 * CLICKS
			 * */

			window
			.pageClickHandlers();

			/**
			 * UPDATE PERMANENT EMAILS DATE FROM NOW
			 * */

			window
			.emailDatesAgo(
				false
			);

			/**
			 * LOAD MAILBOX EMAILS
			 * */

			window
			.sentLoading();

			/**
			 * BACKGROUND INBOX RECEIVED EMAILS
			 * */

			window
			.receivedLoading(
				true
			);

		}
		else if(
			window.inboxCase === 'listing'
		){

			/**
			 * CLICKS
			 * */

			window
			.pageClickHandlers();

			/**
			 * UPDATE PERMANENT EMAILS DATE FROM NOW
			 * */

			window
			.emailDatesAgo(
				false
			);

			/**
			 * LOAD MAILBOX EMAILS
			 * */

			window
			.listingLoading();

			/**
			 * DISPLAY ALERT MODAL
			 * */

			const needToDisplayModal =
			window
			.location
			.hash
			.split(
				'='
			);

			if(
				needToDisplayModal.length > 1 &&
				needToDisplayModal[0] === '#sent-to'
			){
			    Swal
			    .fire(
				    {
				        html: `E-mail well sent to <b>${decodeURI(needToDisplayModal[1])}</b>.`,
				        icon: 'success',
				        buttonsStyling: false,
				        confirmButtonText: 'Ok, got it!',
				        customClass: {
				            confirmButton: "btn btn-success"
				        }
				    }
			    );
	    		setTimeout(
	    			() => {
			    		history
			    		.replaceState(
			    			{},
			    			'',
			    			window
			    			.location
			    			.pathname
			    		);
	    			},
	    			1500
	    		);
			}

		}
		else if(
			window.inboxCase === 'read' ||
			window.inboxCase === 'reply'
		){

			/**
			 * CLICKS
			 * */

			window
			.pageClickHandlers();

			/**
			 * LOAD EMAIL DETAILS
			 * */

			if(
				window.emailId &&
				!window.emailId[1]
			){
				return window
				.goBackFromReplyPage(
					''
				);
			}
			else{
				if(
					window.emailId &&
					window.emailId[1]
				){
					window
					.emailLoading(
						window
						.emailId[1],
						window.inboxCase === 'read'
					);
				}
			}

			/**
			 * LOAD EMAIL BODY HTML
			 * */

			if(
				window.inboxCase === 'reply'
			){
				window
				.locationHashChangedInPreviewPage();
				window
				.onhashchange =
				window
				.locationHashChangedInPreviewPage;
			}
			else{
				window
				.locationHashChangedInPrereadPage();
				window
				.onhashchange =
				window
				.locationHashChangedInPrereadPage;
			}

			/**
			 * ONLINE STATUS ICON
			 * */

			const statusCssClass = 
			[
				'svg-icon-muted',
				'svg-icon-success',
				'svg-icon-success',
				'svg-icon-warning',
				'svg-icon-danger'
			];

			const randomStatusCssClass =
			Math
			.floor(
				Math
				.random() * statusCssClass.length
			);

			document
			.querySelector(
				'.online-status'
			)
			.classList
			.add(
				statusCssClass[randomStatusCssClass]
			);

			/**
			 * HIDE LOADER
			 * */

			window
			.pageLoaderDisabler();

			/**
			 * BACKGROUND INBOX RECEIVED EMAILS 
			 * */

			window
			.receivedLoading(
				true
			);

			/**
			 * MARK THE EMAIL AS READ
			 * */

			if(
				window.inboxCase === 'reply'
			){
				const emailsIsRead = 
				await window.timeNoughProprietaryFrontendTechnology
				.emailController
				.markAsRead(
					{
						emailId: window.emailId[1],
						read: true
					}
				);
			}

		}
		else if(
			window.inboxCase === 'compose'
		){

			/**
			 * AUTO RECIPIENT (via URL)
			 * */

			if(
				window
				.emailId[0] &&
				window
				.emailId[0] === '#mailto' &&
				window
				.emailId[1] &&
				window
				.emailId[1] !== window.demoUsers[window.inboxIndex-1].email
			){

				const emailWeKnow = 
				window
				.senderInfosWeKnowByEmail(
					window.emailId[1]
				);

				const fieldId =
					emailWeKnow[0] && 
					emailWeKnow[0]['toBeAddedInCC'] === true ? 
						1
					: 
						0;

				window
				.tagifyItem[fieldId]
				.addTags(
					[
						{ 
							value: 20,
							name: emailWeKnow[0] ? emailWeKnow[0].name : window.emailId[1],
							avatar: emailWeKnow[0] ? emailWeKnow[0].avatar : 'https://timenough.com/any-picto.php?e=' + window.emailId[1],
							email: emailWeKnow[0] ? emailWeKnow[0].email : window.emailId[1]
						}
					]
				);

				if(
					fieldId === 1
				){
					jQuery(
						'#cc_opener', 
						'body'
					)
					.trigger(
						'click'
					);
				}
			}

			/**
			 * CLICKS
			 * */

			window
			.pageClickHandlers();

			/**
			 * BACKGROUND INBOX RECEIVED EMAILS
			 * */

			window
			.receivedLoading(
				true
			);

		}
		else if(
			window.inboxCase === 'preview'
		){

			const emailHTMLBody = 
			await window.timeNoughProprietaryFrontendTechnology
			.emailController
			.getEmailTextLines(
				{
					decodeHtmlEntities: true,
					emailId: window.emailId[1],
					lineSeparator: "\n"
				}
			);

			if(
				emailHTMLBody.body
			){
				const newBody =
				window
				.bodyHtmlFormatter(
					emailHTMLBody.body
				);

				document
				.write(
					newBody
				);
			}

		}
		else if(
			window.inboxCase === 'preread'
		){

			const emailHTMLBody = 
			await window.timeNoughProprietaryFrontendTechnology
			.sentEmailsController
			.getSentEmailHTMLContent(
				{
					id: window.emailId[1]
				}
			);

			const newBody =
			window
			.bodyHtmlFormatter(
				emailHTMLBody
			);

			document
			.write(
				newBody
			);

		}

		/**
		 * SELECT2 CHANGES
		 * */

		const chatDrawer =
			KTDrawer
				.getInstance(
					document.querySelector(
						'#kt_drawer_chat_2'
					)
				);

		jQuery(
			'#timeNough_top_right_select',
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
					if (
						data.id === '2'
					) {

						chatDrawer
							.show();

					}
					else if (
						data.id === '3'
					) {
						Swal
							.fire(
								{
									html: `Company's <strong>Slack feature</strong> not available in this mailbox demo yet.`,
									icon: 'error',
									buttonsStyling: false,
									confirmButtonText: 'Ok, got it!',
									customClass: {
										confirmButton: "btn btn-danger"
									}
								}
							);
					}

					jQuery(
						'#timeNough_top_right_select',
						'body'
					)
						.val(
							'1'
						)
						.trigger(
							'change'
						);
				}
			);

	}
);