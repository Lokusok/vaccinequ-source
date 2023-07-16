const funcsToCall = [setCorrectMagicLine, setCorrectBurger, setCorrectChoices, setCorrectAutocomplete, setCorrectDateInputs];

screen.orientation.addEventListener('change', () => {
  location.reload();
});

funcsToCall.forEach((func) => {
  func.call(this);
});

function setCorrectMagicLine() {
  const line = document.querySelector('.nav__line');
  const navList = document.querySelector('.nav__list');
  const navItems = navList.querySelectorAll('.nav__list-item');
  const setStyles = (navItem, { searchText = false }) => {
    let toSettingNode = null;

    if (searchText) {
      toSettingNode = navItem.querySelector('span');
    } else {
      toSettingNode = navItem;
    }

    line.style.left = `${toSettingNode.offsetLeft}px`;
    line.style.width = `${toSettingNode.offsetWidth}px`;
  };

  setStyles(navItems[0], { searchText: true });

  navItems.forEach((navItem) => {
    navItem.addEventListener('mouseenter', () => {
      setStyles(navItem, { searchText: true });
    });
  });

  navList.addEventListener('mouseleave', () => {
    const activeItemText = document.querySelector('.nav__list-link.active span');
    setStyles(activeItemText, { searchText: false });
  });
}

function setCorrectBurger() {
  if (!window.matchMedia('(max-width: 780px)').matches) {
    return;
  }

  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.nav__outer');
  const mobileMenuClose = mobileMenu.querySelector('.nav__outer-close');

  burger.addEventListener('click', () => {
    burger.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.classList.add('unscroll');
  });

  mobileMenuClose.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('unscroll');
  });
}

function setCorrectChoices() {
  const selects = document.querySelectorAll('select');

  selects.forEach((select) => {
    new Choices(select, {
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
    });
  });
}

function setCorrectAutocomplete() {
  const configVaccine = {
    selector: "#vaccine-type",
    data: {
        src: ["Cinovac", "Astarzon", "Sinopahm"],
    },
    events: {
      input: {
          selection: (event) => {
              const selection = event.detail.selection.value;
              autoCompleteVaccine.input.value = selection;
          }
      }
    }
  };
  const configLocation = {
    selector: "#location",
    data: {
        src: ["Jakarta, Indonesia", "Madrid, Spain", "Moscow, Russia", "Berlin, Germany", "Vilnus, Lithuania", "Peking, China", "Paris, France", "New Delhi, India"],
    },
    events: {
      input: {
          selection: (event) => {
              const selection = event.detail.selection.value;
              autoCompleteLocation.input.value = selection;
          }
      }
    }
  };

  const configNearLocation = {
    selector: "#near-location",
    data: {
        src: ["Indonesia", "Spain", "Russia", "Germany", "Lithuania", "China", "France", "India"],
    },
    events: {
      input: {
          selection: (event) => {
              const selection = event.detail.selection.value;
              autoCompleteNearLocation.input.value = selection;
          }
      }
    }
  };

  const autoCompleteVaccine = new autoComplete(configVaccine);
  const autoCompleteLocation = new autoComplete(configLocation);
  const autoCompleteNearLocation = new autoComplete(configNearLocation);
}

function setCorrectDateInputs() {
  const dateInputs = document.querySelectorAll('.date-input');
  const nowDate = new Date();
  const minDate = nowDate.getTime();
  nowDate.setMonth(nowDate.getMonth() + 1)
  const maxDate = nowDate.getTime();
  const isMobile = window.matchMedia('(max-width: 460px)').matches;

  dateInputs.forEach((dateInput) => {
    const datepicker = new AirDatepicker(dateInput, {
      locale: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
      },
      minDate: minDate,
      maxDate: maxDate,
      dateFormat: 'dd MMMM, yyyy',
      isMobile: isMobile,
    });
  });
}

function setCorrectModals() {
  MicroModal.init({
    onClose: (modal) => {
      modal.scrollTo({ top: 0 });
    },
    disableScroll: true
  });

  const modals = document.querySelectorAll('.modal');
  const triggerForms = document.querySelectorAll('.trigger-form');

  modals.forEach((modal) => {
    const modalContent = modal.querySelector('.modal__content');

    modalContent.addEventListener('click', (event) => {
      if (!event.target.closest('button[data-micromodal-close]')) {
        event.stopPropagation();
      }
    });
  });

  triggerForms.forEach((triggerForm) => {
    triggerForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (triggerForm.reportValidity()) {
        const submitBtn = triggerForm.querySelector('button[type="submit"]');
        const modalId = submitBtn.dataset.safetyMicromodalTrigger;
        console.log(modalId);
        MicroModal.show(modalId);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setCorrectModals();
  AOS.init({
    disable: 'mobile',
    mirror: true,
  });
});
