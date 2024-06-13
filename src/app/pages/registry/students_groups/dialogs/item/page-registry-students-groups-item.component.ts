import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Group, RegistryService, TranslationService } from '@likdan/studyum-core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-page-registry-groups-item',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './page-registry-students-groups-item.component.html',
  styleUrl: './page-registry-students-groups-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryStudentsGroupsItemComponent {
  private dialogRef = inject(MatDialogRef);
  private translation = inject(TranslationService);
  private registry = inject(RegistryService);

  formConfig = <FormConfig<any>>{
    controls: {
      studentId: {
        type: Controls.select,
        label: this.translation.getTranslation('registry_students_groups_form_student_name'),
        additionalFields: {
          searchable: false,
          items: this.registry.getStudentsPaginatedForSelect()
        },
        validators: [Validators.required],
      },
      groupId: {
        type: Controls.select,
        label: this.translation.getTranslation('registry_students_groups_form_group_name'),
        additionalFields: {
          searchable: false,
          items: this.registry.getGroupsPaginatedForSelect()
        },
        validators: [Validators.required],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('registry_students_groups_form_submit'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
