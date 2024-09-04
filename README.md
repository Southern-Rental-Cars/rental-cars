# Southern Rental Cars LLC

### - How to set up development (local) environment for the preview project (staging) 
1. Switch to dev branch via Git
2. enter cmd ```vercel link``` to link to vercel 'preview' project 
  - First prompt: ```y```
  - Second: ```southern rental cars```
  - Third: ```y```
  - Fourth: ```preview```
3. Copy contents of .env.local or .env.development.local into .env file
4. enter cmd ```npm run dev``` or ```vercel dev``` to run localhost:3000

### - How to set up development (local) environment for prod project (prod)
1. Follow instructions for the preview project. But at step two fourth bullet, input ```prod``` instead of ```preview```

### - How to push latest code changes to the prod project (production)
1. Commit changes and push code to dev branch (IMPORTANT that we don't go to main branch immediately)
2. Go to preview project on vercel dashboard and promote your latest commit to production (note: its the production for the preview project, so if it breaks its not a big deal)
3. Test latest code changes on the preview project
4. Get code review to verify even further
5. Merge to main branch which will update the prod project because prod is linked with main branch

#### Vercel project dashboards
1. Preview: https://vercel.com/southernrentalcars/preview/stores/postgres/store_iwHcqT5Pj7aVHx6q/data
2. Production: https://vercel.com/southernrentalcars/prod/stores/postgres/store_iwHcqT5Pj7aVHx6q/data
