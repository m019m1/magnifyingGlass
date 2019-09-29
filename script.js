class magnifyingGlass {
	constructor(elem, radius) {
		this._img = elem;
		this._loupeRadius = radius;
		this.run();
	}
	run() {
		let {left, right, top, bottom} = getCoords(this._img);
		let originalWidth, scale;
		let self = this;
	
		this._img.addEventListener("mouseenter", showLoupe);
		this._img.addEventListener("touchstart", showLoupe);
		this._img.addEventListener("touchend", removeLoupe);

		function getCoords(elem) {
			let box = elem.getBoundingClientRect();
		
			return {
				//expand border to 1px for correct border conditions
				top: Math.round(box.top) - 1 + pageYOffset,
				bottom: Math.round(box.bottom) + 1 + pageYOffset,
				left: Math.round(box.left) - 1 + pageXOffset,
				right: Math.round(box.right) + 1 + pageXOffset
			};
		}

		function showLoupe(e) {
			self._loupe = document.createElement("div");
			self._loupe.className = 'loupe';
			self._loupe.style.width = self._loupe.style.height = `${self._loupeRadius * 2}px`;
			if(!self._loupe.style.background) {
				self._loupe.style.background =  `url('${this.getAttribute("src")}') no-repeat `;
			}
			onPointerMove(e);
			document.body.append(self._loupe);
			this.removeEventListener("mouseenter", showLoupe);
			this.removeEventListener("touchstart", showLoupe);
			document.addEventListener("mousemove", onPointerMove);
			document.addEventListener("touchmove", onPointerMove);
			
		}
		function onPointerMove() {
			let pageX = ( (event.type == 'touchmove' || event.type == 'touchstart') ? event.touches[0].pageX : event.pageX);
			let pageY = ((event.type == 'touchmove' || event.type == 'touchstart') ? event.touches[0].pageY : event.pageY);
			moveAt(self._loupe, pageX, pageY);
			changeBackgroundPosition(pageX, pageY);
			event.preventDefault();
			// 'mouseleave' event doesn't work here, so it's need to check border conditions
			if(pageX < left || pageX > right || pageY < top || pageY > bottom) {
				removeLoupe();
			}
		}
		function removeLoupe() {
			self._loupe.remove();
			self._img.addEventListener("mouseenter", showLoupe);
			self._img.addEventListener("touchstart", showLoupe);
			document.removeEventListener("mousemove", onPointerMove);
			document.removeEventListener("touchmove", onPointerMove);
		}
		function changeBackgroundPosition(pageX, pageY) {
			if(!originalWidth) {
				let helperImg = document.createElement("img");
				helperImg.src = self._img.src;
				originalWidth = helperImg.width;
			}
			scale = originalWidth / (right - left);
			let [newX, newY] =  [(pageX - left) * scale - self._loupeRadius, 
												   (pageY - top) * scale - self._loupeRadius];
			self._loupe.style.backgroundPosition = `${-newX}px ${-newY}px`;
		}
		function moveAt(elem, pageX, pageY){
			elem.style.left = `${pageX}px`;
			elem.style.top = `${pageY}px`;
		}
	}
}

window.onload = () => {
  let images = document.querySelectorAll("img");
  for(let image of images) {
  	image = new magnifyingGlass(image, 120);
  }
}