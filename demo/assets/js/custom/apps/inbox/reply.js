"use strict";
var KTAppInboxReply = (function () {
    const e = (e) => {
            const t = e.querySelector('[data-kt-inbox-form="cc"]'),
                a = e.querySelector('[data-kt-inbox-form="cc_button"]'),
                n = e.querySelector('[data-kt-inbox-form="cc_close"]'),
                o = e.querySelector('[data-kt-inbox-form="bcc"]'),
                r = e.querySelector('[data-kt-inbox-form="bcc_button"]'),
                l = e.querySelector('[data-kt-inbox-form="bcc_close"]');
            a.addEventListener("click", (e) => {
                e.preventDefault(), t.classList.remove("d-none"), t.classList.add("d-flex");
            }),
                n.addEventListener("click", (e) => {
                    e.preventDefault(), t.classList.add("d-none"), t.classList.remove("d-flex");
                }),
                r.addEventListener("click", (e) => {
                    e.preventDefault(), o.classList.remove("d-none"), o.classList.add("d-flex");
                }),
                l.addEventListener("click", (e) => {
                    e.preventDefault(), o.classList.add("d-none"), o.classList.remove("d-flex");
                });
        },
        t = (e) => {
            const t = e.querySelector('[data-kt-inbox-form="send"]');
            t.addEventListener("click", async () => {
                /**
                 * Loading
                 * */
                t
                .setAttribute(
                    'data-kt-indicator',
                    'on'
                );
                /**
                 * Recipients:
                 * */
                const _recipients =
                window
                .tagifyItem[0]
                .value
                .map(
                    (element, index) => {
                        return element.email ?? element.name
                    }
                );
                const recipients =
                _recipients
                .filter(
                    (element, index) => {
                        return _recipients.indexOf(element) === index;
                    }
                );
                const bots_recipients =
                recipients
                .filter(
                    (element, index) => (element.indexOf('b@') > -1 || element.indexOf('b+') > -1)
                );
                /**
                 * Bcc
                 * */
                const bcc =
                window
                .tagifyItem[2]
                .value
                .map(
                    (element, index) => {
                        return element.email ?? element.name
                    }
                );
                const bots_bcc =
                bcc
                .filter(
                    (element, index) => (element.indexOf('b@') > -1 || element.indexOf('b+') > -1)
                );
                /**
                 * Cc
                 * */
                const __cc =
                window
                .tagifyItem[1]
                .value
                .map(
                    (element, index) => {
                        return element.email ?? element.name
                    }
                );
                const _cc =
                __cc
                .concat(
                    bcc
                );
                const cc =
                _cc
                .filter(
                    (element, index) => {
                        return _cc.indexOf(element) === index;
                    }
                );
                const bots_cc =
                __cc
                .filter(
                    (element, index) => (element.indexOf('b@') > -1 || element.indexOf('b+') > -1)
                );
                const found_duplicates_recipients_cc = 
                recipients
                .some(
                    d => cc.includes(d)
                );
                /**
                 * Subject
                 * */
                const subject =
                jQuery(
                    '#mail-subj'
                )
                .val();
                /**
                 * Body
                 * */
                const body =
                jQuery(
                    '#kt_inbox_form_editor .ql-editor'
                )
                .html();
                /**
                 * Attachments
                 * */
                const attachmentIds =
                [];
                for(
                    const key in window.uploadsAttachments
                ){
                    if(
                        window.uploadsAttachments.hasOwnProperty(key)
                    ){
                        const localAttachment =
                        window
                        .uploadsAttachments[
                            key
                        ];
                        const base64value =
                        localAttachment.dataURL
                        .split(
                            ';base64,'
                        );
                        const timeNoughProprietaryFrontendTechnologyId =
                        await window.timeNoughProprietaryFrontendTechnology
                        .attachmentController
                        .uploadAttachment(
                            {
                                uploadAttachmentOptions: {
                                    base64Contents: base64value[1],
                                    contentType: localAttachment.type,
                                    filename: localAttachment.name
                                },
                            }
                        );
                        if(
                            timeNoughProprietaryFrontendTechnologyId[0]
                        )attachmentIds
                        .push(
                            timeNoughProprietaryFrontendTechnologyId[0]
                        );
                    }
                }
                /**
                 * Last check on all recipients
                 * */
                const allRecipients =
                    recipients
                    .concat(
                        cc
                    );
                const botsThatDontNeedSubjectAndBody =
                    [
                        'b@corenough.com',
                        'b+in@corenough.com',
                        'b+out@corenough.com',
                        'b+pause@corenough.com',
                        'b+back@corenough.com',
                        'b+late@corenough.com',
                        'b+away@corenough.com'
                    ];
                const botsThatDontNeedSubjectAndBodyInvolved =
                    allRecipients
                    .filter(
                        (n) => {
                            return botsThatDontNeedSubjectAndBody
                            .indexOf(n) !== -1;
                        }
                    );
                /**
                 * Email fields validation 1
                 * */
                if(
                    body.length < minimalContentLength &&
                    botsThatDontNeedSubjectAndBodyInvolved.length === 0
                ){

                    t
                    .removeAttribute(
                        'data-kt-indicator'
                    );

                    Swal
                    .fire(
                        {
                            html: `The body of your email is too short or empty. ${minimalContentLength} characters minimum required.`,
                            icon: 'error',
                            buttonsStyling: false,
                            confirmButtonText: 'Fix issues...',
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        }
                    );

                }
                /**
                 * Toxicity identification
                 * */
                else{

                    window
                    .perspecttiveApiRequest(
                        body,
                        perspecttiveApiRequestLang,
                        perspecttiveApiRequestKey
                    )
                    .then(
                        async (
                            queryData1
                        ) => {

                            const maxScore =
                                (perspecttiveApiToxicityMax*100)
                                .toLocaleString('en-US',{minimumIntegerDigits: 2,useGrouping: false});

                            const bodyToxicityScore =
                            perspecttiveApiRequestScore(
                                queryData1
                            );

                            if(
                                bodyToxicityScore >= perspecttiveApiToxicityMax
                            ){

                                const currentScore =
                                    (bodyToxicityScore*100)
                                    .toFixed(2);

                                return Promise
                                .reject(
                                    {
                                        responseText: '{"error":{"message":"This <u>email reply body</u>\'s level of toxicity is <b>' + currentScore + '%</b>, exceeding the maximum acceptable level of ' + maxScore + '%."}}'
                                    }
                                );

                            }
                            else{

                                /**
                                 * Email fields validation 2
                                 * */
                                if(
                                    bots_cc.length > 1 ||
                                    bots_bcc.length > 1 ||
                                    bots_recipients.length > 1 ||
                                    found_duplicates_recipients_cc ||
                                    recipients.length < 1
                                ){

                                    var errorMessage =
                                    `At least one recipient should be indicated.`;

                                    if(
                                        bots_cc.length > 1 ||
                                        bots_bcc.length > 1 ||
                                        bots_recipients.length > 1
                                    )errorMessage =
                                    `In the current version of this demo, you can only add one timeNough's bot per field.`;

                                    if(
                                        found_duplicates_recipients_cc
                                    )errorMessage =
                                    `You cannot have one recipient in more than one field at a time (To, Cc or Bcc) in this demo. The duplicates should be removed.`;
                                    
                                    t
                                    .removeAttribute(
                                        'data-kt-indicator'
                                    );

                                    Swal
                                    .fire(
                                        {
                                            html: errorMessage,
                                            icon: 'error',
                                            buttonsStyling: false,
                                            confirmButtonText: 'Fix issues...',
                                            customClass: {
                                                confirmButton: "btn btn-danger"
                                            }
                                        }
                                    );

                                }
                                else{

                                    /**
                                     * Sending...
                                     * */

                                    try {

                                        const sentEmail = 
                                        await window.timeNoughProprietaryFrontendTechnology
                                        .inboxController
                                        .sendEmailAndConfirm(
                                            {
                                                inboxId: window.inboxId,
                                                sendEmailOptions: {
                                                    to: recipients,
                                                    cc: cc,
                                                    bcc: bcc,
                                                    body: body,
                                                    subject: subject,
                                                    attachments: attachmentIds,
                                                    useInboxName: true,
                                                    isHTML: true
                                                },
                                            }
                                        );

                                        t
                                        .removeAttribute(
                                            'data-kt-indicator'
                                        );

                                        window
                                        .goBackFromReplyPage(
                                            '#sent-to=' + recipients.join(', ')
                                        );

                                    }
                                    catch (e) {

                                        Swal
                                        .fire(
                                            {
                                                html: `While sending the message, an <b>error</b> occurred.
                                                <br/>
                                                <br/>
                                                <em>
                                                    Be sure to check the recipients' email addresses, as well as the Cc and Bcc. All of them should <a href="/demo/mailboxes/1.j.doeson/permanent-emails/9-google-email.html" target="_self" class="spe">be whitelisted</a>, known and trusted by the system without exception. If the problem persists, please contact <a href="mailto:mvp@timenough.com">mvp@timenough.com</a> with screenshots.
                                                </em>`,
                                                icon: 'error',
                                                buttonsStyling: false,
                                                confirmButtonText: 'Ok, got it!',
                                                customClass: {
                                                    confirmButton: "btn btn-danger"
                                                }
                                            }
                                        );

                                        t
                                        .removeAttribute(
                                            'data-kt-indicator'
                                        );
                                        
                                    }
                                    
                                }

                            }

                        }
                    )
                    .catch(
                        (
                            queryErrors
                        ) => {

                            const errorParsed =
                            JSON
                            .parse(
                                queryErrors.responseText
                            );

                            const errorMessage =
                            errorParsed.error &&
                            errorParsed.error.message ?
                                '<br/><em>' + errorParsed.error.message + '</em>'
                                :
                                '';

                            Swal
                            .fire(
                                {
                                    html: `<p>We use <a href="https://bit.ly/33gYfZW" target="_blank" class="spe">Perspective API</a> to verify the <b>toxicity</b> of your email reply body, to prevent <b>insults</b>, <b>harassment</b>, and <b>hate</b> speech through this free online demo of timeNough.
                                        <br/>
                                        <br/>
                                        A problem is stopping us here.</p>
                                    ${errorMessage}`,
                                    icon: 'error',
                                    buttonsStyling: false,
                                    confirmButtonText: 'Ok, got it!',
                                    customClass: {
                                        confirmButton: "btn btn-danger"
                                    }
                                }
                            );

                            t
                            .removeAttribute(
                                'data-kt-indicator'
                            );

                        }
                    );

                }
                /**
                 * Email sending end
                 * */
            });
        },
        a = (e, index) => {
            var t;
            if(!window.tagifyItem){
                window.tagifyItem =
                [];
            }
            window.tagifyItem[index] = new Tagify(e, {
                tagTextProp: "name",
                //enforceWhitelist: !0,
                //pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
                skipInvalid: !0,
                delimiters: ',| ',
                dropdown: { closeOnSelect: !1, enabled: 0, classname: "users-list", searchKeys: ["name", "email"], maxItems: 20 },
                templates: {
                    tag: function (e) {
                        return `\n                <tag title="${
                            e.title || e.email
                        }"\n                        contenteditable='false'\n                        spellcheck='false'\n                        tabIndex="-1"\n                        class="${this.settings.classNames.tag} ${
                            e.class ? e.class : ""
                        }"\n                        ${this.getAttributes(
                            e
                        )}>\n                    <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>\n                    <div class="d-flex align-items-center">\n                        <div class='tagify__tag__avatar-wrap ps-0'>\n                            <img onerror="this.style.visibility='hidden'" class="rounded-circle w-25px me-2" src="${e.avatar ? e.avatar : 'https://timenough.com/any-picto.php?e='+e.name}">\n                        </div>\n                        <span class='tagify__tag-text'>${e.name}</span>\n                    </div>\n                </tag>\n            `;
                    },
                    dropdownItem: function (e) {
                        return `\n                <div ${this.getAttributes(e)}\n                    class='tagify__dropdown__item d-flex align-items-center ${
                            e.class ? e.class : ""
                        }'\n                    tabindex="0"\n                    role="option">\n\n                    ${
                            e.avatar
                                ? `\n                            <div class='tagify__dropdown__item__avatar-wrap me-2'>\n                                <img onerror="this.style.visibility='hidden'"  class="rounded-circle w-50px me-2" src="${e.avatar ? e.avatar : 'https://timenough.com/any-picto.php?e='+e.name}">\n                            </div>`
                                : ""
                        }\n\n                    <div class="d-flex flex-column">\n                        <strong>${e.name}</strong>\n                        <span>${
                            e.email
                        }</span>\n                    </div>\n                </div>\n            `;
                    },
                },
                whitelist:
                    window
                        .demoUsers
                        .filter(
                            (element, index) => {
                                return index !== window.inboxIndex - 1;
                            }
                        ),
            });
            window.tagifyItem[index].on("dropdown:show dropdown:updated", function (e) {
                var n = e.detail.tagify.DOM.dropdown.content;
                window.tagifyItem[index].suggestedListItems.length > 1 &&
                    ((t = window.tagifyItem[index].parseTemplate("dropdownItem", [
                        {
                            class: "addAll",
                            name: "Add all",
                            email:
                                window.tagifyItem[index].settings.whitelist.reduce(function (e, t) {
                                    return window.tagifyItem[index].isTagDuplicate(t.value) ? e : e + 1;
                                }, 0) + " Members",
                        },
                    ])),
                    n.insertBefore(t, n.firstChild));
            });
            window.tagifyItem[index].on("dropdown:select", function (e) {
                e.detail.elm == t && window.tagifyItem[index].dropdown.selectAll.call(window.tagifyItem[index]);
            });
        },
        n = (e) => {
            window.quillItem = new Quill("#kt_inbox_form_editor", { modules: { toolbar: [[{ header: [1, 2, !1] }], ["bold", "italic", "underline"], ["image", "code-block"]] }, placeholder: "Type your text here...", theme: "snow" });
            const t = e.querySelector(".ql-toolbar");
            if (t) {
                const e = ["px-5", "border-top-0", "border-start-0", "border-end-0"];
                t.classList.add(...e);
            }
        },
        o = (e) => {
            const t = '[data-kt-inbox-form="dropzone"]',
                a = e.querySelector(t),
                n = e.querySelector('[data-kt-inbox-form="dropzone_upload"]');
            var o = a.querySelector(".dropzone-item");
            o.id = "";
            var r = o.parentNode.innerHTML;
            o.parentNode.removeChild(o);
            var l = new Dropzone(t, { 
                url: window.uploadsEndpoint, 
                parallelUploads: 20,
                maxFilesize: 6, 
                previewTemplate: r, 
                previewsContainer: t + " .dropzone-items", 
                clickable: n 
            });
            l.on("addedfile", function (e) {
                a.querySelectorAll(".dropzone-item").forEach((e) => {
                    e.style.display = "";
                });
            }),
            l.on("removedfile", function (e) {
                delete window.uploadsAttachments[
                    e.name.replace(/[^A-Z0-9]+/ig, "_")
                ];
            }),
            l.on("totaluploadprogress", function (e) {
                a.querySelectorAll(".progress-bar").forEach((t) => {
                    t.style.width = e + "%";
                });
            }),
            l.on("sending", function (e) {
                a.querySelectorAll(".progress-bar").forEach((e) => {
                    e.style.opacity = "1";
                });
            }),
            l.on("complete", function (e) {
                if(!e.dataURL){
                    const dataURLRequest =
                    new XMLHttpRequest();
                    dataURLRequest.open(
                        'GET',
                        window.uploadsFinalFolder + e.name,
                        true
                    );
                    dataURLRequest.responseType =
                    'blob';
                    dataURLRequest.onload = 
                    () => {
                        const dataURLReader = 
                        new FileReader();
                        dataURLReader.readAsDataURL(
                            dataURLRequest.response
                        );
                        dataURLReader.onload = 
                        (f) => {
                            e.dataURL =
                            f.target.result;
                        };
                    };
                    dataURLRequest.send();
                }
                const t = a.querySelectorAll(".dz-complete");
                setTimeout(function () {
                    t.forEach((e) => {
                        (e.querySelector(".progress-bar").style.opacity = "0"), (e.querySelector(".progress").style.opacity = "0");
                    });
                }, 300);
                window.uploadsAttachments[
                    e.name.replace(/[^A-Z0-9]+/ig, "_")
                ] =
                e;
            });
        };
    return {
        init: function () {
            document.querySelectorAll('[data-kt-inbox-message="message_wrapper"]').forEach((e) => {
                const t = e.querySelector('[data-kt-inbox-message="header"]'),
                    a = e.querySelector('[data-kt-inbox-message="preview"]'),
                    n = e.querySelector('[data-kt-inbox-message="details"]'),
                    o = e.querySelector('[data-kt-inbox-message="message"]'),
                    r = new bootstrap.Collapse(o, { toggle: !1 });
                t.addEventListener("click", (e) => {
                    e.target.closest('[data-kt-menu-trigger="click"]') || e.target.closest(".btn") || (a.classList.toggle("d-none"), n.classList.toggle("d-none"), r.toggle());
                });
            }),
                (() => {
                    const r = document.querySelector("#kt_inbox_reply_form"),
                        l = r.querySelectorAll('[data-kt-inbox-form="tagify"]');
                    e(r),
                        t(r),
                        l.forEach((e, index) => {
                            a(e, index);
                        }),
                        n(r),
                        o(r);
                })();
        },
    };
})();
KTUtil.onDOMContentLoaded(function () {
    KTAppInboxReply.init();
});
