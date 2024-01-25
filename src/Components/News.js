import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner'
import PropTypes from 'prop-types'

export class News extends Component {
   static defaultProps={
    country:'in',
    pageSize:9,
    category:'General'
   }
   static propTypes={
    country:PropTypes.string,
    pageSize:PropTypes.number,
    category:PropTypes.string,
   }
    constructor(props)
    {
        super(props);
        this.state={
           articles:[],
           loading:false,
           page:1,
           
        }
        document.title=`${this.props.category}-Panchaayat`
    }
    async updateNews()
    {
      this.props.setProgress(10);
      let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=97afe5a739504906b7204e980a6163b1&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      this.props.setProgress(30);
      let data=await fetch(url);
      let parsedData=await data.json()
      this.props.setProgress(50);
      console.log(parsedData);
      this.setState({articles:parsedData.articles,
        totalResults:parsedData.totalResults,
        loading:false})
        this.props.setProgress(100);
    }
    async componentDidMount()
    {
      
      this.updateNews();
    }
    
    handlePrevclick = async () => {
      this.setState({page: this.state.page - 1})
      this.updateNews();
    }
    
    handleNextclick = async () => {
    this.setState({page: this.state.page + 1})
    this.updateNews();

  }

    

    
    
  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center" style={{margin:'35px 0px'}}> Top {this.props.category} Headlines</h2>
       {this.state.loading && <Spinner/>}
        <div className="row"  >
        {!this.state.loading && this.state.articles.map((element)=> {
          return <div className="col-md-4" key={element.url}>
              <NewsItem  title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} 
              imageurl={element.urlToImage?element.urlToImage:"https://media.zenfs.com/en/zacks.com/39dfb058875b6e691de9136bc97a47b4"} 
              newsurl={element.url} author={element.author?element.author:"Anonymous"} date={element.publishedAt} source={element.source.name}/>
          </div>
        })}
        
        </div>
          <div className="container my-4 d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevclick}>&larr; Previous</button>
          <button disabled ={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextclick}>Next &rarr;</button>
          </div>
      </div>
    )
  }
}

export default News
