/*!
 * community.js by Christopher Guindon - @chrisguindon
 * Copyright 2013 Eclipse Foundation
 * projects.js by Yi Liu - @yiliu
 * Copyright 2020 Eclipse Foundation
 * http://www.eclipse.org/org/documents/epl-v10.php
 */

const UserProfile = (function ($) {

    $('.eclipsefdn-userprofile').each(function(index, user_block){
        var username = $(this).attr("data-username");
        
        $.ajax({
            type: 'GET',
            url: 'https://api.eclipse.org/account/profile/' + username,
            dataType: 'json',
            cache: true,
            success: function (user_profile) {

                const div = document.createElement('div');

                if (typeof user_profile.picture !== 'undefined' && user_profile.picture !== null) {
                    let img = document.createElement('img');
                    img.setAttribute('src', user_profile.picture);
                    user_block.append(img);
                }
    
                var fullName = "";
                if (typeof user_profile.full_name !== 'undefined' && user_profile.full_name !== null) {
                    fullName = document.createTextNode(user_profile.full_name);
                }
                else {
                    fullName = document.createTextNode(user_profile.name);
                }
                if (fullName !== "") {
                    let h3 = document.createElement('h3');
                    h3.appendChild(fullName);
                    user_block.append(h3);
                }
    
                var job_org = "";
                if (typeof user_profile.job_title !== 'undefined' && user_profile.job_title !== null && user_profile.job_title !== "") {
                    job_org = user_profile.job_title + ", ";
                }
                if (typeof user_profile.org !== 'undefined' && user_profile.org !== null) {
                    job_org += user_profile.org;
                }
                if (job_org !== "") {
                    const org = document.createTextNode(job_org);
                    let h4 = document.createElement('h4');
                    h4.appendChild(org);
                    user_block.append(h4);
                }
    
                if (typeof user_profile.bio !== 'undefined' && user_profile.bio !== null) {
                    let p = document.createElement('p');
                    const bio = document.createTextNode(user_profile.bio);
                    p.appendChild(bio);
                    user_block.append(p);
                }
            },
        });
    });

})(jQuery);
// The global jQuery object is passed as a parameter

export default UserProfile;
