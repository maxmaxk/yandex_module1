export const loginTemplate = `
    <form class="form" method="post" id="user-login">
        <h1 class="form__title">#loginTitle#</h1>
        #labledInputs#
        <span class="form__error-msg">#errorMessage#</span>
        <button class="form__submit#submitWaiting#" id="form-submit">#submitTitle#</button>
        <a class="form__registration" href="#registrationUrl#">#registrationTitle#</a>
    </form>
`;
