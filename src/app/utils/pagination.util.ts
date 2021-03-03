export default class PaginationUtil {
  page = 1;
  totalPage = 0;
  total = 0;
  perPage = 10;
  perPages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  start = 0;
  end = 0;
  search = '';
  open = false;
  filters = [];

  initPagination(data) {
    this.start = data.from;
    this.end = data.to;
    this.total = data.total;
    this.totalPage = data.lastPage;
  }

  openAdvSearch() {
    this.open = true;
  }

  closeFilter() {
    this.open = false;
  }

  clearSearch() {
    this.search = '';
  }

  preventBubble(e) {
    e.stopPropagation();
  }

  calculateSkipType(n: number) {
    switch (n) {
      case 1:
        if (this.page < this.totalPage) {
          this.page++;
        }
        break;
      case 2:
        if (this.page > 1) {
          this.page--;
        }
        break;
      case 3:
        this.page = 1;
        break;
      default:
        this.page = this.totalPage;
    }
  }
}
