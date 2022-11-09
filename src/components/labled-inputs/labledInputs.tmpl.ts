export const labledInputsTemplate = `
<*li class="form__input-block">
  <div class="input-block__container">
    <label class="input-block__title" for="#item.id#">#item.title#</label>
    <input class="input-block__input #item.isInvalidClass#" id="#item.id#" name="#item.id#" type="#item.type#" value=#item.value#></input>
  </div>
  <span class="input-block__error-text">#item.errorMessage#</span>
</li*>  
`;
