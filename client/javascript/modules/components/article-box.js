/** @jsx React.DOM */

'use strict';

var React = require('react');
var ReactAsync = require('react-async');

// helpers
var helpers = require('../../../../helpers/common')();

// addons
var InfiniteScroll = require('react-infinite-scroll')(React);
var Masonry = require('react-masonry-component');

// options
var masonryOptions = {};

// sub-components
var Article = require('./article');

module.exports = React.createClass({
    displayName: 'ArticleBox',

    mixins: [ReactAsync.Mixin,],

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.category !== this.props.category) {
            this.setState({
                page: 0,
                articles: [],
                hasMore: true
            });
        }
    },

    getInitialStateAsync: function (callback) {
        callback(null, {
            page: 0,
            articles: [],
            hasMore: true
        });
    },
    loadMoreArticles: function (page) {
      this.props.api.entries.get({
          page: page,
          perPage: this.props.perPage,
          category: this.props.category
      }, function (err, articles) {
          if (err) {
            return console.log(err);
          } else {
            this.setState({
                page: page + 1,
                articles: helpers.createUniqueArray(this.state.articles.concat(articles), 'guid'),
                hasMore: articles.length === this.props.perPage
            });
          }
      }.bind(this));
    },

    getLoaderElement: function () {
        return null;

        return (
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <div className='thumbnail article text-center'>Loading <i className='fa fa-cog fa-spin'></i></div>
            </div>
        );
    },

    getArticlesToRender: function () {
        return this.state.articles.map(function (article) {
            return (
                <Article
                    key={article.guid}
                    article={article}
                />
            );
        });
    },

    render: function () {
        return (
            <div className='container'>
                <div className='row'>
                    <div>
                        <InfiniteScroll
                            pageStart={this.state.page - 1}
                            loader={this.getLoaderElement()}
                            loadMore={this.loadMoreArticles}
                            hasMore={this.state.hasMore}
                            threshold={1000}
                        >
                            {
                            <Masonry elementType={'div'} options={masonryOptions}>
                                {this.getArticlesToRender()}
                            </Masonry>
                            }
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        );
    }
});
