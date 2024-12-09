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
  departmentArray:any;

  constructor(
    private api: ServiceApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.defaultForm();
    this.getAllDepartment();
    this.getUserData();
  }

  defaultForm() {
    this.addUpdateForm = this.fb.group({
      id: [0],
      firstName: ['',Validators.required],
      middleName: ['',Validators.required],
      lastName: ['',Validators.required],
      gender: ['',Validators.required],
      emailId: ['',Validators.required],
      contactNo: ['',Validators.required],
      department: ['',Validators.required],
      document: [''],
    })
  }

  getUserData() {
    let obj = this.textFilter.value?.trim() + '&limit=' + 10 + '&page=' + this.pageNo;
    this.api.get('getAll?fullName=' + obj).subscribe((res) => {
      this.usersArray = res.rows;
      this.getTotal = res.metadata?.totalRecords;
    });
  }

  getAllDepartment() {
    this.api.getDepartment().subscribe((res) => {
      this.departmentArray = res.responseData;
    });
  }

  openInputFile() {
    let clickInputFile:any = document.getElementById("img-upload");
    clickInputFile?.click();
  }

  openDoc(url:any){
    window.open(url, '_blank');
  }

  fileUpload(event:any) {
    let selectedFile:any = event.target.files[0];  // Capture the selected file
        this.api.uploadFile('upload',selectedFile).subscribe(
          (response) => {
            this.addUpdateForm.controls['document'].setValue(response.imageUrl);
          },
          (error) => {
            console.error(error);
          }
        );
  }

  onSubmit() {
    if(!this.addUpdateForm.valid){
      alert('all field is required');
      return;
    } else{
      let obj = {
        // "id": 0,
        "firstName": this.addUpdateForm.value.firstName,
        "middleName": this.addUpdateForm.value.middleName,
        "lastName": this.addUpdateForm.value.lastName,
        "gender": this.addUpdateForm.value.gender,
        "emailId": this.addUpdateForm.value.emailId,
        "contactNo": this.addUpdateForm.value.contactNo,
        "department": +this.addUpdateForm.value.department,
        "document": this.addUpdateForm.value.document
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
        this.api.updateApi('update/' + this.addUpdateForm.value.id, JSON.stringify(obj)).subscribe({
          next: (res: any) => {
          if(res.statusCode === 200){
          this.defaultForm();
          this.getUserData();
          this.editFlag = false;
          } 
            alert(res.message);
        }, error: ((error:any) => { alert(error.error.message); })
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
      firstName: obj.firstName,
      middleName: obj.middleName,
      lastName: obj.lastName,
      gender: obj.gender,
      emailId: obj.emailId,
      contactNo: obj.contactNo,
      department: +obj.department,
      document: obj.document
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
