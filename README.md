## Modern Stack Portfolio [GraphQL]
Part of the [Modern Stack Portfolio](https://github.com/aretecode/modern-stack-web-portfolio)

[Current Deployment](https://jameswiens-graphql.now.sh/graphql)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/aretecode/modern-stack-portfolio-graphql)

## Learn More
- [json placeholder api](https://jsonplaceholder.typicode.com/)
- [now.json with apollo](https://github.com/zeit/now-examples/blob/master/apollo/now.json)
- [now.json with ts](https://github.com/zeit/og-image/blob/master/now.json)
- [now.json with ts & express & apollo](https://github.com/kyledetella/ts-on-now-2.0)
- [redis](https://redislabs.com/blog/redis-cloud-30mb-ram-30-connections-for-free/)
- [zeit now env secrets](https://zeit.co/docs/v2/deployments/environment-variables-and-secrets)

## Docker
1. `yarn build`
2. `docker build .`
3. `docker tag __TAG__ aretecode/modern-stack-portfolio-graphql:v__VERSION__`
4. `docker push aretecode/modern-stack-portfolio-graphql:v__VERSION__`
5. `docker run -d -p 4444:4000 __TAG__`
