const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.dashboardHeader = 'h6.oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module';
  }

  async isDashboardVisible() {
    return await this.page.isVisible(this.dashboardHeader);
  }
}

module.exports = DashboardPage;
