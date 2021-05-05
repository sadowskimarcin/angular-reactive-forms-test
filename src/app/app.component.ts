import { Component, VERSION } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  modelForm: FormGroup;

  formErrors = {
    firstname: "",
    lastname: ""
  };

  private validationMessages = {
    firstname: {
      required: "firstname is required"
    },
    lastname: {
      required: "lastname is required",
      minlength: "lastname must have at least 3 characters"
    }
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.modelForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", Validators.required],
      phone: "",
      subscription: "email",
      card: this.formBuilder.group({
        cvv: "",
        cardNumber: "",
        expirationDate: ""
      }),
      positions: this.formBuilder.array([])
    });

    this.modelForm.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      this.onControlValueChanged();
    });

    this.onControlValueChanged(); // ustawiamy początkowany stan walidacji
  }

  onSubmit(form): void {
    console.log(form.value);
  }

  onControlValueChanged() {
    const form = this.modelForm;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const validationMessages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += validationMessages[key] + " ";
        }
      }
    }
  }

  setSubscription(notifyBy: string): void {
    const control = this.modelForm.get("phone");
    if (notifyBy === "sms") {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
    }

    control.updateValueAndValidity();
  }

  setCardValidation(): void {
    const cardGroup = this.modelForm.controls["card"] as FormGroup;
    const cardGroupControlsKeys = Object.keys(cardGroup.controls);

    cardGroupControlsKeys.forEach(key => {
      cardGroup.controls[key].setValidators(Validators.required);
      cardGroup.controls[key].updateValueAndValidity();
    });
  }

  buildPosition(): FormGroup {
    return this.formBuilder.group({
      job: "",
      company: "",
      city: ""
    });
  }

  get positions(): FormArray {
    return <FormArray>this.modelForm.get("positions");
  }

  addPosition() : void {
    this.positions.push(this.buildPosition());
  }

  removePosition(i) : void {
    this.positions.removeAt(i);
  }
}
