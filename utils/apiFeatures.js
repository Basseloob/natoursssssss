class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1 ) Build the Query - Filtering :
    // console.log('req.query = ', req.query);
    // const queryObj = { ...req.query };  // req.query replaced with this.queryString becasue --> not going to be available inside this class...
    const queryObj = { ...this.queryString };
    // console.log(' queryObj = ', queryObj); // the Filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 2 ) Advanced Filtering :
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (matchedString) => `$${matchedString}`
    );
    console.log('pasrsed queryString = ', JSON.parse(queryString));
    console.log('pasrsed queryString $ = ', queryString);

    this.query = this.query.find(JSON.parse(queryString));

    return this; // this is the entire obj.
  }

  sort() {
    // 3 ) Sorting :
    if (this.queryString.sort) {
      console.log(this.queryString.sort); //( {{URL}}api/v1/tours?sort=duration&sort=price) --> it will create an array and the split is used for the strings no the array , so we are using (const hpp = require('hpp') :

      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log('sortBy = ', sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      // query = query.sort('createdAt');
      this.query = this.query.sort('_id'); // pagination fix.
    }

    return this; // this is the entire obj.
  }

  limitFields() {
    // 4 ) fields limiting:
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log('Fileds we want to show only - fieldsLimiting = ', fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this; // this is the entire obj.
  }

  paginate() {
    // 5 ) Pagination :
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // if (this.queryString.page) {
    //   const numTours = await TourModel.countDocuments();
    //   if (skip >= numTours) throw new Error('This page dosent exist !!!');
    // }

    return this; // this is the entire obj.
  }
}

module.exports = APIFeatures;
