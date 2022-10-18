export const registrationTemplate = `
<div class="flexcontainer">
    <form class="form" method="post" onsubmit="return onSubmitRegistration(this)">
        <h1 class="form__title">#registrationTitle#</h1>
        <ul class="form__input-blocks">
            <*li class="form__input-block">
                <label class="input-block__title" for="#item.id#">#item.title#</label>
                <input class="input-block__input" id="#item.id#" name="#item.id#" type="#item.type#"></input>
            </li*>
        </ul>
        <button class="form__submit">#submitTitle#</button>
    </form>
</div>
`;