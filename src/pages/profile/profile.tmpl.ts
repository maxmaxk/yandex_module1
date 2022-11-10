export const profileTemplate = `
    <div class="profile__container">
        <div class="profile__image-container">
            <img class="profile__image" alt="avatar" src="#profileImage#"></img>
        </div>
        <h1 class="profile__title">#profileTitle#</h1>
        <form method="post" id="profile-form">
            #labledStateInputs#
            <div class="profile__managment-container">
                <button class="profile__change-data">#profileChangeDataTitle#</button>
                <button class="profile__logout">#profileLogoutTitle#</button>
            </div>
        </form>
    </div>
`;
