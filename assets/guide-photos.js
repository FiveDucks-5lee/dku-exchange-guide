(() => {
  const pictures = [...document.querySelectorAll('article figure img, article .infobox img')];
  if (!pictures.length || !('HTMLDialogElement' in window)) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'photo-dialog';
  dialog.setAttribute('aria-label', '사진 크게 보기');
  dialog.innerHTML = `<div class="photo-dialog-head"><p aria-live="polite"></p><div class="photo-dialog-controls"><button type="button" data-photo-prev aria-label="이전 사진">← 이전</button><button type="button" data-photo-next aria-label="다음 사진">다음 →</button><button type="button" class="photo-dialog-close" aria-label="사진 보기 닫기">닫기 ×</button></div></div><figure><img alt=""><figcaption></figcaption></figure>`;
  document.body.append(dialog);
  const preview = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  const counter = dialog.querySelector('p');
  let current = 0;
  let opener = null;
  const show = index => {
    current = (index + pictures.length) % pictures.length;
    const picture = pictures[current];
    preview.src = picture.dataset.full || picture.currentSrc || picture.src;
    preview.alt = picture.alt;
    const originalCaption = picture.closest('figure')?.querySelector('figcaption');
    caption.replaceChildren();
    if (originalCaption) {
      [...originalCaption.childNodes].forEach(node => caption.append(node.cloneNode(true)));
    } else caption.textContent = picture.alt;
    counter.textContent = `${current + 1} / ${pictures.length} · 사진 보기`;
    caption.scrollTop = 0;
  };
  pictures.forEach((picture, index) => {
    if (picture.closest('a,button')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo-open';
    button.setAttribute('aria-label', `${picture.alt || '사진'} 크게 보기`);
    picture.before(button);
    button.append(picture);
    button.addEventListener('click', () => {
      opener = button;
      show(index);
      dialog.showModal();
      document.body.classList.add('photo-viewing');
      dialog.querySelector('.photo-dialog-close').focus();
    });
  });
  dialog.querySelector('[data-photo-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-photo-next]').addEventListener('click', () => show(current + 1));
  dialog.querySelector('.photo-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('photo-viewing');
    preview.removeAttribute('src');
    opener?.focus({preventScroll: true});
  });
})();
