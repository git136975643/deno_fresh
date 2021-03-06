export function isObject(object) {
    return typeof object == "object" && object !== null &&
        object.constructor === Object;
}
export function sortObject(normalized) {
    const sorted = {};
    const sortedKeys = Object.keys(normalized)
        .sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
        sorted[key] = normalized[key];
    }
    return sorted;
}
export function isImportMap(importMap) {
    return isObject(importMap) &&
        (importMap.imports !== undefined ? isImports(importMap.imports) : true) &&
        (importMap.scopes !== undefined ? isScopes(importMap.scopes) : true);
}
export function isImports(importsMap) {
    return isObject(importsMap);
}
export function isScopes(scopes) {
    return isObject(scopes) &&
        Object.values(scopes).every((value) => isSpecifierMap(value));
}
export function isSpecifierMap(specifierMap) {
    return isObject(specifierMap);
}
export function isURL(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFXQSxNQUFNLFVBQVUsUUFBUSxDQUFDLE1BQWU7SUFDdEMsT0FBTyxPQUFPLE1BQU0sSUFBSSxRQUFRLElBQUksTUFBTSxLQUFLLElBQUk7UUFDakQsTUFBTSxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUM7QUFDbEMsQ0FBQztBQUNELE1BQU0sVUFBVSxVQUFVLENBQ3hCLFVBQW1DO0lBRW5DLE1BQU0sTUFBTSxHQUE0QixFQUFFLENBQUM7SUFDM0MsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDdkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsS0FBSyxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUU7UUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQjtJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFDRCxNQUFNLFVBQVUsV0FBVyxDQUFDLFNBQWtCO0lBQzVDLE9BQU8sUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdkUsQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUNELE1BQU0sVUFBVSxTQUFTLENBQ3ZCLFVBQW1CO0lBRW5CLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFDRCxNQUFNLFVBQVUsUUFBUSxDQUN0QixNQUFlO0lBRWYsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBQ0QsTUFBTSxVQUFVLGNBQWMsQ0FDNUIsWUFBcUI7SUFFckIsT0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUNELE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBWTtJQUNoQyxJQUFJO1FBQ0YsSUFBSSxHQUFHLENBQUMsR0FBYSxDQUFDLENBQUM7UUFDdkIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUFDLE1BQU07UUFDTixPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgU3BlY2lmaWVyTWFwIHtcbiAgW3VybDogc3RyaW5nXTogc3RyaW5nIHwgbnVsbDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcGVzIHtcbiAgW3VybDogc3RyaW5nXTogU3BlY2lmaWVyTWFwO1xufVxuZXhwb3J0IGludGVyZmFjZSBJbXBvcnRNYXAge1xuICBpbXBvcnRzPzogU3BlY2lmaWVyTWFwO1xuICBzY29wZXM/OiBTY29wZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChvYmplY3Q6IHVua25vd24pOiBvYmplY3QgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PSBcIm9iamVjdFwiICYmIG9iamVjdCAhPT0gbnVsbCAmJlxuICAgIG9iamVjdC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRPYmplY3QoXG4gIG5vcm1hbGl6ZWQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBzb3J0ZWQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGNvbnN0IHNvcnRlZEtleXMgPSBPYmplY3Qua2V5cyhub3JtYWxpemVkKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcbiAgZm9yIChjb25zdCBrZXkgb2Ygc29ydGVkS2V5cykge1xuICAgIHNvcnRlZFtrZXldID0gbm9ybWFsaXplZFtrZXldO1xuICB9XG4gIHJldHVybiBzb3J0ZWQ7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNJbXBvcnRNYXAoaW1wb3J0TWFwOiB1bmtub3duKTogaW1wb3J0TWFwIGlzIEltcG9ydE1hcCB7XG4gIHJldHVybiBpc09iamVjdChpbXBvcnRNYXApICYmXG4gICAgKGltcG9ydE1hcC5pbXBvcnRzICE9PSB1bmRlZmluZWQgPyBpc0ltcG9ydHMoaW1wb3J0TWFwLmltcG9ydHMpIDogdHJ1ZSkgJiZcbiAgICAoaW1wb3J0TWFwLnNjb3BlcyAhPT0gdW5kZWZpbmVkID8gaXNTY29wZXMoaW1wb3J0TWFwLnNjb3BlcykgOiB0cnVlKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0ltcG9ydHMoXG4gIGltcG9ydHNNYXA6IHVua25vd24sXG4pOiBpbXBvcnRzTWFwIGlzIEltcG9ydE1hcCB7XG4gIHJldHVybiBpc09iamVjdChpbXBvcnRzTWFwKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1Njb3BlcyhcbiAgc2NvcGVzOiB1bmtub3duLFxuKTogc2NvcGVzIGlzIFNjb3BlcyB7XG4gIHJldHVybiBpc09iamVjdChzY29wZXMpICYmXG4gICAgT2JqZWN0LnZhbHVlcyhzY29wZXMpLmV2ZXJ5KCh2YWx1ZSkgPT4gaXNTcGVjaWZpZXJNYXAodmFsdWUpKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1NwZWNpZmllck1hcChcbiAgc3BlY2lmaWVyTWFwOiB1bmtub3duLFxuKTogc3BlY2lmaWVyTWFwIGlzIFNwZWNpZmllck1hcCB7XG4gIHJldHVybiBpc09iamVjdChzcGVjaWZpZXJNYXApO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVVJMKHVybDogdW5rbm93bik6IGJvb2xlYW4ge1xuICB0cnkge1xuICAgIG5ldyBVUkwodXJsIGFzIHN0cmluZyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19