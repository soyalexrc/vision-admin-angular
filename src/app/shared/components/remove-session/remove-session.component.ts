import { Component } from '@angular/core';

@Component({
  selector: 'app-remove-session-forbidden-content',
  template: `
    <div *nzModalContent>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
      <p>Modal Content</p>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="default" >Custom Callback</button>
      <button nz-button nzType="primary" >Custom Submit</button>
    </div>
`,
  styleUrls: ['./remove-session.component.scss']
})
export class RemoveSessionForbiddenContentComponent {

}

@Component({
  selector: 'app-remove-session-forbidden-footer',
  template: `
   <nz-modal [nzVisible]="true" nzTitle="title">
     <div *nzModalContent>
       <p>Modal Content</p>
       <p>Modal Content</p>
       <p>Modal Content</p>
       <p>Modal Content</p>
       <p>Modal Content</p>
     </div>
     <div *nzModalFooter>
       <span>Modal Footer:</span>
       <button nz-button nzType="default" >Custom Callback</button>
       <button nz-button nzType="primary" >Custom Submit</button>
     </div>
   </nz-modal>
`,
  styleUrls: ['./remove-session.component.scss']
})
export class RemoveSessionForbiddenFooterComponent {

}
