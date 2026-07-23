// Temporary preview session: change this value to inspect each account view's modal.
// Real authenticated role/session data will replace this fixture later.
export const temporarySession = {
    //accountView: 'SL View', // 'SL View' | 'Regional View' | 'Core View'
    //accountView: 'Regional View',
    accountView: 'Core View',
};

const accountViews = ['SL View', 'Regional View', 'Core View'];

export function getTemporaryAccountView() {
    return accountViews.includes(temporarySession.accountView)
        ? temporarySession.accountView
        : 'SL View';
}
