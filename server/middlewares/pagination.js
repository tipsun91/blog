/**
 * Автор: TiPsun (tipsun911@gmail.com)
 * https://forum.wapinet.ru/wap/viewtopic.php?pid=25468#p25468
 * (c) 2013
 * Блогодарность за помощь
 * в написании кода:
 ++ Gemorroj (http://wapinet.ru/)
 ++ Akdmeh (Akdmeh@gmail.com)
**/

module.exports = class Pagination {
  static #SHOW_ALL = 'all';
  // Дано
  #pageCursor = 1;
  #itemsCount = 0;
  #itemsRange = 10;
  // Результат
  #pagesCount = 1;
  #pageNumber = 1;
  #startPoint = 0;

  /**
   * Конструктор
   * @param number count
   * @param number page
   * @param number items
   * @return void
   */
  constructor(count, page, items) {
    this.setCount(count);
    this.setCursor(page);
    this.setItems(items);
  }

  /**
   * Проверка числа.
   * @param number value
   * @return number | bool
   */
  static #isNumeric(value) {
    const number = Number(value);
    return (
      Number.isNaN(number)            === false
      && Number.isFinite(number)      === true
      && Number.isInteger(number)     === true
      && Number.isSafeInteger(number) === true
    )
    ? number
    : false;
  }

  /**
   * Проверка числа на принадлежность к множеству натуральных.
   * @param number value
   * @return bool
   */
  static #isNatural(value) {
    const number = Pagination.#isNumeric(value);
    return (number && 0 < number);
  }

  /**
   * Регистрация общего кол-ва записей.
   * @param number value
   * @return Pagination
   */
  setCount(value) {
    if (Pagination.#isNatural(value)) {
      this.#itemsCount = Number(value);
      this.#pagesCount = null;
    }
    return this;
  }

  /**
   * Регистрация текущей страницы.
   * @param number value
   * @return Pagination
   */
  setCursor(value) {
    if (Pagination.#isNatural(value)) {
      this.#pageCursor = Number(value);
      this.#pageNumber = null;
    }
    return this;
  }

  /**
   * Регистрация кол-ва записей на страницу.
   * @param number | string value
   * @return Pagination
   */
  setItems(value) {
    if (Pagination.#isNatural(value)) {
      this.#itemsRange = Number(value);
      this.#pagesCount = null;
      this.#startPoint = null;
    } else if (value === Pagination.#SHOW_ALL) {
      this.#itemsRange = this.#itemsCount;
      this.#pagesCount = null;
      this.#startPoint = null;
    }
    return this;
  }

  /**
   * Расчет общего кол-ва страниц.
   * @return number
   */
  getPages() {
    if (null === this.#pagesCount) {
      if (this.#itemsCount) {
        this.#pagesCount = Math.ceil(this.#itemsCount / this.#itemsRange);
      }
    }
    return this.#pagesCount;
  }

  /**
   * Получение номера корректной текущей страницы.
   * @return number
   */
  getPage() {
    if (null === this.#pageNumber) {
      this.#pageNumber = Math.min(this.#pageCursor, this.getPages());
    }
    return this.#pageNumber;
  }

  /**
   * Расчет начальной точки отсчета показа записей в вашем цикле.
   * @return number
   */
  #calculateStartPoint() {
    if (null === this.#startPoint) {
      this.#startPoint = (this.getPage() - 1) * this.#itemsRange;
    }
    return this.#startPoint;
  }

  /**
   * Расчет конечной точки отсчета показа записей в цикле для массива данных.
   * @return number[]
   */
  getArrayPoints() {
    return [
      this.#calculateStartPoint(),
      Math.min((this.#startPoint + this.#itemsRange), this.#itemsCount)
    ];
  }

  /**
   * Расчет конечной точки отсчета показа записей в цикле для данных
   * в таблице (DB).
   * @return number[]
   */
  getTablePoints() {
    return [
      this.#calculateStartPoint(),
      this.#itemsRange
    ];
  }

  /**
   * Расчет конечной точки отсчета показа записей в цикле для данных
   * в таблице (DB).
   * @return string
   */
  getTableLimit() {
    return `LIMIT ${this.#calculateStartPoint()}, ${this.#itemsRange}`;
  }
};
