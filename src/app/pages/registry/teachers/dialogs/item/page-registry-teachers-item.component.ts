import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Room, TranslationService } from '@likdan/studyum-core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-page-registry-teachers-item',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './page-registry-teachers-item.component.html',
  styleUrl: './page-registry-teachers-item.component.css',
  host: {
    class: 'accent-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryTeachersItemComponent {
  private dialogRef = inject(MatDialogRef);
  private data = inject<Room | null>(MAT_DIALOG_DATA);
  private translation = inject(TranslationService);

  formConfig = <FormConfig<any>>{
    controls: {
      name: {
        type: Controls.textInput,
        label: this.translation.getTranslation('registry_teachers_form_name'),
        validators: [Validators.required],
      },
    },
    initialValue: {
      name: this.data?.name ?? '',
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translation.getTranslation('registry_teachers_form_submit'),
      onSubmit: e => {
        if (!e.valid) return;

        this.dialogRef.close(e.value);
      },
    },
  };
}
