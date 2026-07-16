export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-split-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-split-img-col');
        }
      }

      // convert video links (e.g. .mp4) into an inline video element
      const videoLink = col.querySelector('a[href$=".mp4"], a[href$=".webm"]');
      if (videoLink) {
        const video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.controls = false;
        const source = document.createElement('source');
        source.src = videoLink.href;
        source.type = videoLink.href.endsWith('.webm') ? 'video/webm' : 'video/mp4';
        video.append(source);
        const wrapper = videoLink.closest('p') || videoLink;
        wrapper.replaceWith(video);
      }

      // group stat pairs (big number <p><strong> followed by a caption <p>)
      // into a dedicated stats wrapper so they can lay out as a clean row
      const statNumbers = [...col.children].filter(
        (p) => p.tagName === 'P' && p.querySelector(':scope > strong') && p.textContent.trim() === p.querySelector('strong').textContent.trim(),
      );
      if (statNumbers.length > 1) {
        const stats = document.createElement('div');
        stats.className = 'columns-split-stats';
        statNumbers.forEach((numP) => {
          const item = document.createElement('div');
          item.className = 'columns-split-stat';
          const label = numP.nextElementSibling;
          numP.replaceWith(item);
          item.append(numP);
          if (label && label.tagName === 'P') item.append(label);
        });
        // place the stats wrapper where the first stat item now sits
        const firstItem = col.querySelector('.columns-split-stat');
        if (firstItem) {
          firstItem.parentElement.insertBefore(stats, firstItem);
          col.querySelectorAll(':scope > .columns-split-stat').forEach((it) => stats.append(it));
        }
      }

      // ensure a standalone CTA link renders as an outlined button
      col.querySelectorAll(':scope > p > a:only-child').forEach((link) => {
        const p = link.parentElement;
        if (p.textContent.trim() === link.textContent.trim() && !link.querySelector('img')) {
          link.classList.add('button');
          p.classList.add('button-container');
        }
      });
    });
  });
}
