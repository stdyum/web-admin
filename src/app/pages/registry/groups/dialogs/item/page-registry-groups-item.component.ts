import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilderComponent, FormConfig } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Group } from '@likdan/studyum-core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-page-registry-groups-item',
  standalone: true,
  imports: [
    FormBuilderComponent,
  ],
  templateUrl: './page-registry-groups-item.component.html',
  styleUrl: './page-registry-groups-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageRegistryGroupsItemComponent {
  private dialogRef = inject(MatDialogRef);
  private data = inject<Group | null>(MAT_DIALOG_DATA);

  formConfig = <FormConfig<any>>{
    controls: {
      name: {
        type: Controls.textInput,
        label: 'Name',
        validators: [Validators.required],
      },
    },
    initialValue: {
      name: this.data?.name ?? '',
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
