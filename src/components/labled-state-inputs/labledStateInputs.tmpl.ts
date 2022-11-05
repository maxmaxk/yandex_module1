export const labledStateInputsTemplate: string = `
<*li class="profile-detail#item.isHidden#">
    <span class="profile-detail__title"><b>#item.title#:</b>&nbsp</span>
    <input 
        class="profile-detail__value#dataChangeMode##item.isInvalidClass#" 
        value="#item.value#" 
        #isReadOnly#
        name=#item.id#
        id=#item.id#
        type=#item.type#>
    </input>
</li*>
`;