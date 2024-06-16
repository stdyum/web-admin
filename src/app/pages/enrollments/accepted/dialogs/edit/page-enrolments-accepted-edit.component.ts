import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Enrollment, TranslationService } from '@likdan/studyum-core';
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
  private translation = inject(TranslationService);

  formConfig = <FormConfig<any>>{
    controls: {
      permissions: {
        type: Controls.select,
        label: this.translation.getTranslation('enrollments_accepted_form_permissions'),
        additionalFields: {
          items: computed(() => [
            {
              value: 'enrollments',
              display: this.translation.getTranslation('permission_enrollments')(),
            },
            {
              value: 'registry',
              display: this.translation.getTranslation('permission_registry')(),
            },
            {
              value: 'schedule',
              display: this.translation.getTranslation('permission_schedule')(),
            },
            {
              value: 'journal',
              display: this.translation.getTranslation('permission_journal')(),
            },
          ]),
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
      buttonText: this.translation.getTranslation('enrollments_accepted_form_submit'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
