import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../Services/service-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss']
})
export class AddUpdateComponent implements OnInit {

  usersArray: any;
  addUpdateForm: FormGroup | any;
  editFlag: boolean = false;
  highlightRow:any;
  textFilter = new FormControl('');
  pageNo  = 1;
  getTotal:any;

  constructor(
    private api: ServiceApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.defaultForm();
    this.getUserData();
  }

  defaultForm() {
    this.addUpdateForm = this.fb.group({
      id: [0],
      name: ['',Validators.required],
      roll_no: ['',Validators.required],
      fees: ['',Validators.required],
      medium: ['',Validators.required]
    })
  }

  getUserData() {
    let obj = this.textFilter.value?.trim() + '&limit=' + 10 + '&page=' + this.pageNo;
    this.api.get('getAll?name=' + obj).subscribe((res) => {
      this.usersArray = res.rows;
      this.getTotal = res.metadata?.totalRecords;
    });
  }

  onSubmit() {
    if(!this.addUpdateForm.valid){
      alert('all field is required');
      return;
    } else{
      let obj = {
        "name": this.addUpdateForm.value.name,
        "roll_no": +this.addUpdateForm.value.roll_no,
        "fees": +this.addUpdateForm.value.fees,
        "medium": this.addUpdateForm.value.medium,
      }
      if (this.editFlag == false) {
        this.api.postApi('create', JSON.stringify(obj)).subscribe({


          next: (res: any) => {
            if(res.statusCode == 200){
              alert(res.message);
              this.defaultForm();
              this.pageNo = 1;
              this.getUserData();
            } else{
              alert(res.message);
            }
          },
          error: ((error:any) => { alert(error.error.message); })
        });
      } else {
        this.api.updateApi('update/' + this.addUpdateForm.value.id, JSON.stringify(obj)).subscribe((res) => {
          console.log('data response', res);
          alert("Data Update Successfully");
          this.defaultForm();
          this.getUserData();
          this.editFlag = false;
        });
      }
    }
  }

  deleteApi(id:any) {
    this.api.deleteApi('delete/' + id).subscribe((res) => {
      alert("Data Delete Successfully");
      this.pageNo = 1;
      this.getUserData();
    });
  }

  editForm(obj?: any) {
    this.editFlag = true;
    this.highlightRow = obj.id;
    this.addUpdateForm.patchValue({
      id: obj.id,
      name: obj?.name,
      roll_no: obj?.roll_no,
      fees: obj?.fees,
      medium: obj?.medium
    })
  }

  clearForm(){
    this.defaultForm();
    this.editFlag = false;
    this.highlightRow = '';
  }

  
  onClickPagintion(pageNo: number) {
    this.pageNo = pageNo;
    this.getUserData();
    this.clearForm();
  }

}
