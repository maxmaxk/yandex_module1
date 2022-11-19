export const registrationTemplate = `
    <form class="form" method="post" id="registration">
        <h1 class="form__title">#registrationTitle#</h1>
        #labledInputs#
        <span class="form__error-msg">#errorMessage#</span>
        <button class="form__submit#submitWaiting#" id="form-submit">#submitTitle#</button>
    </form>
`;
