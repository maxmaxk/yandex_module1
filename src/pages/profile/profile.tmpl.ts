export const profileTemplate = `
    <div class="profile__container">
        <div class="profile__image-container">
            <img class="profile__image" alt="avatar" src="#profileImage#"></img>
        </div>
        <h1 class="profile__title">#profileTitle#</h1>
        <form method="post" id="profile-form">
            #labledStateInputs#
            <div class="profile__managment-container">
                <span class="profile__error-msg">#errorMessage#</span>
                <button class="profile__change-data#submitWaiting#" id="form-submit">#profileChangeDataTitle#</button>
                <button class="profile__go-back">#profileGoBackTitle#</button>
                <button class="profile__logout">#profileLogoutTitle#</button>
            </div>
        </form>
    </div>
`;
