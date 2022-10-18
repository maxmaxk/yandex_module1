export const profileTemplate = `
<div class="profile">
    <div class="profile__container">
        <div class="profile__image-container">
            <img class="profile__image" src="#profileImage#"></img>
        </div>
        <h1 class="profile__title">#profileTitle#</h1>
        <form method="post" onsubmit="#onLogout#">
            <ul class="profile__details">
                <*li class="profile-detail#item.isHidden#">
                    <span class="profile-detail__title"><b>#item.title#:</b>&nbsp</span>
                    <input 
                        class="profile-detail__value#dataChangeMode#" 
                        value="#item.value#" 
                        #isReadOnly#
                        name=#item.name#
                        type=#item.type#>
                    </input>
                </li*>
            </ul>
            <div class="profile__managment-container">
                <button class="profile__change-data" onclick="#onChangeData#">#profileChangeDataTitle#</button>
                <button class="profile__logout">#profileLogoutTitle#</button>
            </div>
        </form>
    </div>
</div>
`;