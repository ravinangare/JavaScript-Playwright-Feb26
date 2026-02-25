const BasePage = require('./BasePage');

class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.adminTab = 'a[href*="admin/viewAdminModule"]';
    this.userManagementHeader = 'span.oxd-topbar-header-breadcrumb';
    this.addButton = 'button:has-text("Add")';
    this.searchButton = "//button[text()=' Search ']";
    this.usernameField = "(//input[@class='oxd-input oxd-input--active'])[2]";
    this.adminusernameField = "(//div[contains(text(),'admin')])[1]";
    this.addButton= "div.orangehrm-header-container>button.oxd-button.oxd-button--medium.oxd-button--secondary";
    this.userRole="(//i[@class='oxd-icon bi-caret-down-fill oxd-select-text--arrow'])[1]";
    this.selectAdmin = "(//span[contains(text(),'admin')])[2]";
    this.userStatus="(//i[@class='oxd-icon bi-caret-down-fill oxd-select-text--arrow'])[2]";
    this.SelectEnabled="//span[text()='Enabled']";
    this.searchEmployee="//input[@placeholder='Type for hints...']";
    this.SelectFirstEmp= "//span[text()='Ravi M B']";
    this.userName="(//div//input[@class='oxd-input oxd-input--active'])[2]";
    this.password="(//input[@type='password'])[1]";
    this.confirmPassword="(//input[@type='password'])[2]";
    this.saveButton="//button[text()=' Save ']";
  }

  async goToAdminTab() {
    await this.click(this.adminTab);
  }

  async isUserManagementVisible() {
    return await this.isVisible(this.userManagementHeader);
  }

  async searchUser(username) {
    await this.fill(this.usernameField, username);
    await this.click(this.searchButton);
  }
  async clickonAddButton(){
    await this.click(this.addButton);
  }
  async selectUserRoleAsAdmin(){
    await this.click(this.userRole);
    await this.click(this.selectAdmin);
  }
  async SelectUserStatusAsEnabled(){
    await this.click(this.userStatus);
    await this.click(this.SelectEnabled);
  }
  async clickonSearchEmp(){
    await this.click(this.searchEmployee);
  }
  async SearchEmployee(empname){
    await this.fill(this.searchEmployee,empname)
    await this.click(this.SelectFirstEmp);
  }
  async EnterUsername(uname){
    await this.fill(this.userName,uname);
  }
  async EnterPassword(pword){
    await this.fill(this.password,pword);
  }
  async EnterConfirmPassword(cpword){
    await this.fill(this.confirmPassword,cpword);
  }
  async ClickonSaveButton(){
    await this.click(this.saveButton);
  }
}

module.exports = AdminPage;
