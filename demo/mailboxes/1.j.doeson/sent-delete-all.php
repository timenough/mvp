<?php
/**
 * Created by PhpStorm.
 * User: timeNough Europe Inc.
 * Date: 22/03/2022
 * Time: 10:03
 * @license https://github.com/timenough/mvp/blob/master/LICENSE-CC-BY-NC-SA - License CC BY-NC-SA 4.0
 * @author Arnaud M. Lagardère <arnaud@timenough.com>
 */

/*****************************************************************/
/********************* 1/5 KEY VARIABLES *************************/
/*****************************************************************/

const SOURCES_PATH =
    __DIR__
        . '/../../../mvp/sources';

/***************************************************************/
/********************* 2/5 DEPENDENCIES ************************/
/***************************************************************/

try {

    if (
        !file_exists(
            SOURCES_PATH . '/php/vendor/autoload.php'
        )
    ) {

        throw new ErrorException (
            'The following file: "' . SOURCES_PATH . '/php/vendor/autoload.php" does not exists. Program abort.',
            500,
            E_ERROR,
            'Internal Server Error'
        );

    }

    require_once (
        SOURCES_PATH . '/php/vendor/autoload.php'
    );

    require_once (
        SOURCES_PATH . '/php/proprietary/environment.php'
    );

    require_once (
        SOURCES_PATH . '/php/proprietary/aliases.php'
    );

    require_once (
        SOURCES_PATH . '/php/proprietary/html.php'
    );

    require_once (
        SOURCES_PATH . '/php/proprietary/mail-technology.php'
    );

    /**********************************************************************/
    /********************* 3/5 ACCESS CONTROLLING ************************/
    /**********************************************************************/

    $_too_many_http_requests_check_seconds =
        0;

    $_too_many_http_requests_check_max_per_second =
        5;

    $_too_many_http_requests_check_bucket =
        new \bandwidthThrottle\tokenBucket\TokenBucket (
            $_too_many_http_requests_check_max_per_second,
            new \bandwidthThrottle\tokenBucket\Rate (
                $_too_many_http_requests_check_max_per_second,
                \bandwidthThrottle\tokenBucket\Rate::MINUTE
            ),
            new \bandwidthThrottle\tokenBucket\storage\FileStorage (
                SOURCES_PATH . '/images/favicon-bandwidth.ico'
            )
        );

    $_too_many_http_requests_check_bucket ->
        bootstrap (
            $_too_many_http_requests_check_max_per_second
        );

    if (
        !$_too_many_http_requests_check_bucket ->
            consume (
                1,
                $_too_many_http_requests_check_seconds
            )
    ) {

        header (
            'HTTP/ 429 Too Many Requests',
            false,
            429
        );

        header (
            sprintf (
                'Retry-After: %d',
                floor (
                    $_too_many_http_requests_check_seconds
                )
            )
        );

        throw new ErrorException (
            'You have sent too many requests in a given amount of time (rate limiting).',
            429,
            E_ERROR,
            'Too Many Requests'
        );

    }

    /*******************************************************************/
    /********************* 4/5 DELETE ALL LOGIC ************************/
    /*******************************************************************/

    global $_mail_technology_instance_3;

    $_server_hour =
        intval (
            date (
                'H'
            )
        );

    if (
        $_server_hour === 23
    ) {

        $_mail_technology_instance_3 ->
            deleteAllSentEmails ();

    }

    /***********************************************************/
    /********************* 5/5 REDIRECT ************************/
    /***********************************************************/

    header (
        'Location: ' . SERVER_BASE_URL . '/demo/mailboxes/1.j.doeson/sent.html'
    );

    exit;

}
catch (
    ErrorException $e
) {

    header (
        'HTTP/1.1 '
        . $e ->
            getCode ()
    );

    /**
     * Deliver & output the HTML
     * */

    htmlDeliveringForAnyOtherProcess (
        0,
        __DIR__ . '/../preferences/template-hybrid.html',
        array (
            '*|SERVER|*',
            '*|HTML-TITLE|*',
            '*|HTML-ERROR-MESSAGE|*',
        ),
        array (
            SERVER_BASE_URL,
            $e ->
                getFile (),
            $e ->
                getMessage ()
        ),
        true,
        false,
        false
    );

}