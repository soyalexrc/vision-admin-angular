import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signature-canvas',
  templateUrl: './signature-canvas.component.html',
  styleUrls: ['./signature-canvas.component.scss']
})
export class SignatureCanvasComponent {
  @ViewChild('signatureCanvas', { static: true }) signatureCanvas!: ElementRef;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private drawing: boolean = false;

  ngAfterViewInit() {
    this.canvas = this.signatureCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = 'black';
    this.addMouseEvents();
    this.addTouchEvents();
  }

  private addTouchEvents() {
    this.canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      this.drawing = true;
      const touch = event.touches[0];
      this.ctx.beginPath();
      this.ctx.moveTo(touch.clientX - this.canvas.offsetLeft, touch.clientY - this.canvas.offsetTop);
    });

    this.canvas.addEventListener('touchmove', (event) => {
      if (this.drawing) {
        event.preventDefault();
        const touch = event.touches[0];
        this.ctx.lineTo(touch.clientX - this.canvas.offsetLeft, touch.clientY - this.canvas.offsetTop);
        this.ctx.stroke();
      }
    });

    this.canvas.addEventListener('touchend', () => {
      this.drawing = false;
    });

    this.canvas.addEventListener('touchcancel', () => {
      this.drawing = false;
    });
  }

  private addMouseEvents() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.drawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop);
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.drawing) {
        this.ctx.lineTo(event.clientX - this.canvas.offsetLeft, event.clientY - this.canvas.offsetTop);
        this.ctx.stroke();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.drawing = false;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.drawing = false;
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveSignature() {
    const dataUrl = this.canvas.toDataURL(); // This is the base64-encoded image of the signature
    console.log(dataUrl);
    // Send the dataUrl to your backend for further processing (e.g., save it to a database)
  }
}
