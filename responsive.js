// Keep the mobile reading and keyboard order aligned with its visual layout.
const profilePhoneLayout=window.matchMedia('(max-width:650px)');
function arrangeProfile(){const carousel=document.querySelector('.profile-carousel'),role=document.querySelector('.personal-role'),columns=document.querySelector('.personal-content');if(profilePhoneLayout.matches){if(carousel.previousElementSibling!==role)role.after(carousel)}else if(carousel.parentElement!==columns){columns.append(carousel)}}
arrangeProfile();profilePhoneLayout.addEventListener('change',arrangeProfile);
