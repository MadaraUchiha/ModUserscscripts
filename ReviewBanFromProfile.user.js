// ==UserScript==
// @name         Review Ban from profile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add useful links to ban and unban from review directly from the user's profile.
// @author       Madara Uchiha
// @match          *://stackoverflow.com/*
// @match          *://serverfault.com/*
// @match          *://superuser.com/*
// @match          *://meta.stackoverflow.com/*
// @match          *://meta.serverfault.com/*
// @match          *://meta.superuser.com/*
// @match          *://stackapps.com/*
// @match          *://*.stackexchange.com/*
// @match          *://askubuntu.com/*
// @match          *://meta.askubuntu.com/*
// @match          *://answers.onstartups.com/*
// @match          *://meta.answers.onstartups.com/*
// @match          *://mathoverflow.net/*
// @match          *://area51.stackexchange.com/proposals/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// ==/UserScript==
/* jshint -W097 */
'use strict';

const getFKey = () => unsafeWindow.StackExchange.options.user.fkey;
const getUserId = () => document.querySelector('[id^=user-moderator-link]').id.split('-').pop();
const findBanElement = () => document.querySelector('.user-panel-mod-info tr:nth-child(2) .mod-label.extra-padding').nextElementSibling;
const isUserReviewBanned = () => !!findBanElement().querySelector('a');

const generateLink = (text, onclick) => {
    let a = document.createElement('a');
    a.textContent = text;
    a.href = '#';
    a.addEventListener('click', e => {
        console.log('Clicked!', e);
        e.preventDefault();
        onclick(e);
    });

    return a;
};
const generateBanLink = () => generateLink('ban', e => {
    let reason = prompt('Reason (supports markdown)');
    let duration = prompt('Duration (days)');

    let xml = new XMLHttpRequest();
    let form = new FormData();
    form.append('fkey', getFKey());
    form.append('userId', getUserId());
    form.append('explanation', reason);
    form.append('days', duration);

    xml.open('post', '/admin/review/ban-user');
    xml.onload = () => alert(`Done! Banned this user from reviewing for ${duration} days.`);
    xml.send(form);
});

const generateUnbanLink = () => generateLink('unban', e => {
    let xml = new XMLHttpRequest();
    let form = new FormData();
    form.append('fkey', getFKey());
    form.append('userId', getUserId());

    xml.open('post', '/admin/review/unban-user');
    xml.onload = () => alert(`Done! Unbanned this user.`);
    xml.send(form);

});


findBanElement().appendChild(isUserReviewBanned() ? generateUnbanLink() : generateBanLink());