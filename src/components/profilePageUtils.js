export function getProfilePicture() {
    return localStorage.getItem('profilePicture') || 'default-profile-picture-url';
}