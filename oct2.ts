.
@Query(returns => DqCaseBreachDetail)
async getDqBreachDetails(
    @Args('dqCaseProps') dqCaseProps: DqCaseBreachDetailInput,
    @Context('req') req
): Promise<any> {
    const breachUUID = req?.headers?.['breachUUID'];
    const { skip, take, sort, filter } = dqCaseProps;

    try {
        const configData = await this.impalaConfigService.getConfig({ breachUUID });
        const query = configData?.impalaQry.replace('{db}', configData.databaseName); // Replace DB name

        console.log('**** impalaQry:', configData?.impalaQry, configData.databaseName);

        // Handle filter if present
        if (filter && filter.filters.length > 0) {
            const getQuery = this.SOSExpression(filter); // Construct filter expression
            query = `${query} ${getQuery}`; // Add filter to the query
        }

        // Handling sorting
        if (sort && sort.length > 0) {
            const sortQuery = sort.map((s) => `${s.key} ${s.dir.toUpperCase()}`).join(', '); // Map sort keys and directions
            query = `${query} ORDER BY ${sortQuery}`; // Append sort to query
        }

        // Handle pagination
        const totalQuery = query; // Keep the original query for total calculation
        if (take && Array.isArray(take)) {
            query = `${query} LIMIT ${take}`; // Limit the number of results if take is specified
        } else {
            query = `${query} LIMIT ${take}`; // Default limit
        }

        query = `${query} OFFSET ${skip}`; // Add offset for pagination
        console.log('*** finalQuery:', query); // Log final query for debugging

        // Execute the query
        const impalaResponse = await axios({
            method: 'POST',
            url: `${impalaService}/exec`,
            data: {
                query,
                // Include any other necessary data here
            },
        });

        const result = impalaResponse.data; // Assuming the response contains the data directly

        getLogger().debug(`Successfully Retrieved Dx Case Details for breachUUID: ${breachUUID}`);
        return {
            error: result.error ? result.msg : false,
            data: result.error ? result.error : result.data,
            paginationData: {
                total: result.totalCount,
                skip,
                take,
                sort,
                filter,
            },
        };
    } catch (error) {
        getLogger().debug('Error retrieving Dx Case Details');
        getLogger().error('Error retrieving Dx Case Details', error); // Log the error
    }
}
