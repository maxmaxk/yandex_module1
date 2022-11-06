export const labledInputsTemplate = `
<*li class="form__input-block">
    <label class="input-block__title" for="#item.id#">#item.title#</label>
    <input class="input-block__input #item.isInvalidClass#" id="#item.id#" name="#item.id#" type="#item.type#" value=#item.value#></input>
</li*>  
`;
