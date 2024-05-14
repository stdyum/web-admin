import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Enrollment } from '@likdan/studyum-core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-page-enrolments-accepted-edit',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './page-enrolments-accepted-edit.component.html',
  styleUrl: './page-enrolments-accepted-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageEnrolmentsAcceptedEditComponent {
  private dialogRef = inject(MatDialogRef);
  private data = inject<Enrollment>(MAT_DIALOG_DATA);

  formConfig = <FormConfig<any>>{
    controls: {
      permissions: {
        type: Controls.select,
        label: 'Permissions',
        additionalFields: {
          items: [
            { value: 'enrollments', display: 'Enrollments' },
            { value: 'registry', display: 'Registry' },
            { value: 'schedule', display: 'Schedule' },
            { value: 'journal', display: 'Journal' },
          ],
          multiple: true,
          searchable: false,
        },
      },
    },
    initialValue: {
      permissions: this.data.permissions,
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: 'Submit',
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
