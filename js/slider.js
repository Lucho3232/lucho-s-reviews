    const slidesEl = document.querySelector('.slides');
    const slideCount = document.querySelectorAll('.slide').length;
    const btnLeft = document.querySelector('.arrow--left');
    const btnRight = document.querySelector('.arrow--right');
    const thumbs = document.querySelectorAll('.thumbnail');
    let current = 0;
    let isDragging = false, startX = 0, currentTranslate = 0, prevTranslate = 0, animationID;

    function setPosition() {
      currentTranslate = prevTranslate = -current * slidesEl.offsetWidth;
      slidesEl.style.transform = `translateX(${-current * 100}%)`;
      thumbs.forEach(t => t.classList.remove('active'));
      thumbs[current].classList.add('active');
    }

    btnLeft.addEventListener('click', () => {
      current = (current - 1 + slideCount) % slideCount;
      setPosition();
    });
    btnRight.addEventListener('click', () => {
      current = (current + 1) % slideCount;
      setPosition();
    });
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        current = Number(thumb.dataset.index);
        setPosition();
      });
    });

    // Prevenir drag nativo de imágenes
    slidesEl.addEventListener('dragstart', e => e.preventDefault());

    // Drag events
    slidesEl.addEventListener('mousedown', touchStart);
    slidesEl.addEventListener('mouseup', touchEnd);
    slidesEl.addEventListener('mouseleave', touchEnd);
    slidesEl.addEventListener('mousemove', touchMove);
    slidesEl.addEventListener('touchstart', touchStart);
    slidesEl.addEventListener('touchend', touchEnd);
    slidesEl.addEventListener('touchmove', touchMove);

    function touchStart(event) {
      event.preventDefault();
      isDragging = true;
      startX = getPositionX(event);
      slidesEl.classList.add('grabbing');
      animationID = requestAnimationFrame(animation);
    }
    function touchMove(event) {
      if (isDragging) {
        const currentX = getPositionX(event);
        currentTranslate = prevTranslate + currentX - startX;
      }
    }
    function touchEnd() {
      cancelAnimationFrame(animationID);
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -100) current = (current + 1) % slideCount;
      if (movedBy > 100) current = (current - 1 + slideCount) % slideCount;
      setPosition();
      slidesEl.classList.remove('grabbing');
    }

    function getPositionX(evt) {
      return evt.type.includes('mouse') ? evt.pageX : evt.touches[0].clientX;
    }
    function animation() {
      slidesEl.style.transform = `translateX(${currentTranslate}px)`;
      if (isDragging) requestAnimationFrame(animation);
    }

    window.addEventListener('load', setPosition);