const visibleCheckboxes = document.querySelectorAll(`.checky`);
visibleCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener(`change`, () => {
        const hiddenCheckbox = checkbox.nextElementSibling;
        checkbox.checked ? (hiddenCheckbox.value = `Yes`) : (hiddenCheckbox.value = `No`);
    })
);
