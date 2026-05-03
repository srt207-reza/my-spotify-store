export const NAME_REGEX = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getAge(dateString: string) {
    if (!dateString) return null;

    const dob = new Date(dateString);
    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age -= 1;
    }

    return age;
}

export function isPasswordValid(password: string) {
    if (!password) return true;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumberOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password);
    const hasMinLength = password.length >= 10;
    return hasLetter && hasNumberOrSpecial && hasMinLength;
}