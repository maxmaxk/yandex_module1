export const labledStateInputsTemplate = `
<*li class="profile-detail#item.isHidden#">
    <div class="profile-detail__container">
        <span class="profile-detail__title"><b>#item.title#:</b>&nbsp</span>
        <input 
            class="profile-detail__value#dataChangeMode##item.isInvalidClass#" 
            value="#item.value#" 
            #isReadOnly#
            name=#item.id#
            id=#item.id#
            type=#item.type#>
        </input>
    </div>
    <span class="profile-detail__error-text#dataChangeMode#">#item.errorMessage#</span>
</li*>
`;
